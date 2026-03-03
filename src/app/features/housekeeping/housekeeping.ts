import { Component, signal, computed, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../core/services/profile.service';
import { HousekeepingService } from '../../core/services/housekeeping.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { PageToolbarComponent } from '../../shared/components/page-toolbar/page-toolbar.component';
import { RoomCardComponent } from '../../shared/components/room-card/room-card.component';

export interface RoomAssignment {
  id: number;
  roomName: string;
  guestName: string;
  status: 'Dirty' | 'Clean' | 'Inspected';
  taskType: string;
  taskIcon: 'rush' | 'departure' | 'stayover';
  actionState: 'start' | 'in-progress' | 'done';
  startedAt?: string;
  linen?: string;
  points: number;
  minutes: number;
  hasCopy?: boolean;
  assignee: string;
  assigneeIcon: 'blocked' | 'check';
  assigneeExtra?: string;
  dateRange: string;
}

@Component({
  selector: 'app-housekeeping',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, PageToolbarComponent, RoomCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="hk">

      <!-- ── Top Header (sticky) ── -->
      <app-page-header
        title="Cleaning - All Rooms"
        [rolePillLabel]="selectedRole()"
        [roleOptions]="roles"
        [showHelpIcon]="false"
        [showTitleChevron]="true"
        (roleChanged)="onRoleChanged($event)"
        (avatarClicked)="profileSvc.open()">
      </app-page-header>

      <!-- ── Toolbar (scrolls with content) ── -->
      <app-page-toolbar
        [filterCount]="activeFilterCount()"
        [sortActive]="selectedSort() !== 'none'"
        [sortLabel]="selectedSort() === 'none' ? 'Sort by Priority' : sortLabel()"
        (searchChanged)="searchQuery.set($event)"
        (filterClicked)="filterPanelOpen.set(true)"
        (sortClicked)="sortPanelOpen.set(true)">
      </app-page-toolbar>

      <!-- ── Filter Panel ── -->
      @if (filterPanelOpen()) {
        <div class="panel-backdrop" (click)="filterPanelOpen.set(false)"></div>
        <div class="filter-panel">
          <div class="filter-panel__header">
            <span class="filter-panel__title">Filters</span>
            <button class="filter-panel__clear" (click)="clearFilters()">Clear All</button>
          </div>

          <div class="filter-section">
            <div class="filter-section__label">Status</div>
            @for (s of statusOptions; track s) {
              <label class="filter-option">
                <input type="checkbox" [checked]="selectedStatuses().includes(s)"
                       (change)="toggleStatus(s)"/>
                <span class="filter-option__dot" [class.dot-dirty]="s==='Dirty'" [class.dot-clean]="s==='Clean'" [class.dot-inspected]="s==='Inspected'"></span>
                {{ s }}
              </label>
            }
          </div>

          <hr class="filter-divider"/>

          <div class="filter-section">
            <div class="filter-section__label">Task Type</div>
            @for (t of taskOptions; track t) {
              <label class="filter-option">
                <input type="checkbox" [checked]="selectedTasks().includes(t)"
                       (change)="toggleTask(t)"/>
                {{ t }}
              </label>
            }
          </div>

          <hr class="filter-divider"/>

          <div class="filter-section">
            <div class="filter-section__label">Action State</div>
            @for (a of actionOptions; track a.value) {
              <label class="filter-option">
                <input type="checkbox" [checked]="selectedActions().includes(a.value)"
                       (change)="toggleAction(a.value)"/>
                {{ a.label }}
              </label>
            }
          </div>

          <button class="filter-panel__apply" (click)="filterPanelOpen.set(false)">Apply</button>
        </div>
      }

      <!-- ── Sort Panel ── -->
      @if (sortPanelOpen()) {
        <div class="panel-backdrop" (click)="sortPanelOpen.set(false)"></div>
        <div class="sort-panel">
          <div class="sort-panel__header">Sort By</div>
          @for (opt of sortOptions; track opt.value; let last = $last) {
            <button class="sort-panel__item"
                    [class.sort-panel__item--active]="selectedSort() === opt.value"
                    (click)="applySort(opt.value)">
              <span>{{ opt.label }}</span>
              @if (selectedSort() === opt.value) {
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="#1d4ed8" stroke-width="2.2"
                        stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              }
            </button>
            @if (!last) { <hr class="sort-panel__divider"/> }
          }
        </div>
      }

      <!-- ── Room Count ── -->
      <div class="hk__count">{{ filteredRooms().length }} rooms</div>

      <!-- ── Room Cards ── -->
      @if (loading()) {
        <div class="hk__loading">Loading rooms…</div>
      }
      <div class="hk__list">
        @for (room of filteredRooms(); track room.id) {
          <app-room-card [room]="room"/>
        }
      </div>

      <!-- ── FAB ── -->
      <button class="fab" aria-label="Open task list">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
          <path d="M3 6h18M3 12h18M3 18h18" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>

    </div>
  `,
  styles: [`
    /* ── Page wrapper ── */
    .hk {
      display: flex;
      flex-direction: column;
      min-height: 100%;
      background: #f3f4f6;
      font-family: inherit;
      position: relative;
      padding-bottom: 88px;
    }
    .hk__count {
      padding: 10px 16px 6px;
      font-size: 13px;
      color: #6b7280;
    }

    .hk__loading {
      padding: 32px 16px;
      text-align: center;
      font-size: 14px;
      color: #9ca3af;
    }

    /* ── Card list ── */
    .hk__list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 4px 12px 12px;
    }

    /* ── FAB ── */
    .fab {
      position: fixed;
      bottom: 76px;
      right: 20px;
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: rgba(99, 102, 241, 0.7);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.18);
    }

    /* ── Shared panel backdrop ── */
    .panel-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.35);
      z-index: 210;
    }

    /* ── Filter Panel (slides up from bottom) ── */
    .filter-panel {
      position: fixed;
      bottom: 64px;
      left: 0;
      right: 0;
      background: #fff;
      border-radius: 20px 20px 0 0;
      box-shadow: 0 -4px 24px rgba(0,0,0,0.15);
      z-index: 211;
      padding: 20px 20px 24px;
      max-height: 80vh;
      overflow-y: auto;
    }

    .filter-panel__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 18px;
    }

    .filter-panel__title {
      font-size: 18px;
      font-weight: 700;
      color: #111827;
    }

    .filter-panel__clear {
      background: none;
      border: none;
      font-size: 14px;
      color: #dc2626;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      padding: 4px 0;
    }

    .filter-section { margin-bottom: 4px; }

    .filter-section__label {
      font-size: 12px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 10px;
    }

    .filter-option {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 11px 0;
      font-size: 15px;
      color: #111827;
      font-weight: 400;
      cursor: pointer;
      font-family: inherit;
    }

    .filter-option input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: #1d4ed8;
      cursor: pointer;
      flex-shrink: 0;
    }

    .filter-option__dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .dot-dirty     { background: #dc2626; }
    .dot-clean     { background: #16a34a; }
    .dot-inspected { background: #2563eb; }

    .filter-divider {
      border: none;
      border-top: 1px solid #f3f4f6;
      margin: 10px 0 16px;
    }

    .filter-panel__apply {
      width: 100%;
      margin-top: 20px;
      padding: 15px;
      background: #1d4ed8;
      color: #fff;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
    }

    /* ── Sort Panel ── */
    .sort-panel {
      position: fixed;
      bottom: 64px;
      left: 0;
      right: 0;
      background: #fff;
      border-radius: 20px 20px 0 0;
      box-shadow: 0 -4px 24px rgba(0,0,0,0.15);
      z-index: 211;
      padding: 20px 0 24px;
    }

    .sort-panel__header {
      font-size: 18px;
      font-weight: 700;
      color: #111827;
      padding: 0 20px 16px;
    }

    .sort-panel__item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 16px 20px;
      background: none;
      border: none;
      font-size: 15px;
      color: #111827;
      font-family: inherit;
      cursor: pointer;
      text-align: left;
      font-weight: 400;
    }
    .sort-panel__item--active { font-weight: 600; color: #1d4ed8; }
    .sort-panel__item:active  { background: #f3f4f6; }

    .sort-panel__divider {
      border: none;
      border-top: 1px solid #f3f4f6;
      margin: 0;
    }
  `],
})
export class Housekeeping implements OnInit {
  private hkService = inject(HousekeepingService);
  profileSvc = inject(ProfileService);

  // ── Data ──
  rooms = signal<RoomAssignment[]>([]);
  loading = signal(true);

  // ── Role (owned by PageHeaderComponent; keep selectedRole for filteredRooms binding) ──
  selectedRole = signal('Supervisor');
  readonly roles = ['Attendant', 'Supervisor', 'Productivity'];

  onRoleChanged(role: string): void {
    this.selectedRole.set(role);
  }

  // ── Search (owned by PageHeaderComponent; keep searchQuery for filteredRooms) ──
  searchQuery = signal('');

  // ── Filter panel ──
  filterPanelOpen = signal(false);
  readonly statusOptions: RoomAssignment['status'][] = ['Dirty', 'Clean', 'Inspected'];
  readonly taskOptions = ['Room Rush', 'Departure Clean', 'Stay Over'];
  readonly actionOptions = [
    { value: 'start' as const,       label: 'Not Started' },
    { value: 'in-progress' as const, label: 'In Progress' },
    { value: 'done' as const,        label: 'Done' },
  ];
  selectedStatuses = signal<RoomAssignment['status'][]>([]);
  selectedTasks    = signal<string[]>([]);
  selectedActions  = signal<RoomAssignment['actionState'][]>([]);

  activeFilterCount = computed(() =>
    this.selectedStatuses().length +
    this.selectedTasks().length +
    this.selectedActions().length
  );

  // ── Sort panel ──
  sortPanelOpen = signal(false);
  selectedSort  = signal<string>('none');
  readonly sortOptions = [
    { value: 'points-desc',  label: 'Priority: High → Low (Points)' },
    { value: 'points-asc',   label: 'Priority: Low → High (Points)' },
    { value: 'minutes-asc',  label: 'Quickest First (Minutes)' },
    { value: 'minutes-desc', label: 'Longest First (Minutes)' },
    { value: 'none',         label: 'Default Order' },
  ];

  sortLabel = computed(() =>
    this.sortOptions.find(o => o.value === this.selectedSort())?.label ?? 'Sort'
  );

  // ── Filtered + sorted list ──
  filteredRooms = computed(() => {
    let list = [...this.rooms()];

    // Search
    const q = this.searchQuery().trim().toLowerCase();
    if (q) {
      list = list.filter(r =>
        r.roomName.toLowerCase().includes(q) ||
        r.guestName.toLowerCase().includes(q) ||
        r.taskType.toLowerCase().includes(q) ||
        r.assignee.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q)
      );
    }

    const statuses = this.selectedStatuses();
    if (statuses.length) list = list.filter(r => statuses.includes(r.status));

    const tasks = this.selectedTasks();
    if (tasks.length) list = list.filter(r => tasks.includes(r.taskType));

    const actions = this.selectedActions();
    if (actions.length) list = list.filter(r => actions.includes(r.actionState));

    switch (this.selectedSort()) {
      case 'points-desc':  list.sort((a, b) => b.points - a.points);   break;
      case 'points-asc':   list.sort((a, b) => a.points - b.points);   break;
      case 'minutes-asc':  list.sort((a, b) => a.minutes - b.minutes); break;
      case 'minutes-desc': list.sort((a, b) => b.minutes - a.minutes); break;
    }
    return list;
  });

  // ── Helpers ──
  toggleStatus(s: RoomAssignment['status']): void {
    this.selectedStatuses.update(arr =>
      arr.includes(s) ? arr.filter(x => x !== s) : [...arr, s]
    );
  }

  toggleTask(t: string): void {
    this.selectedTasks.update(arr =>
      arr.includes(t) ? arr.filter(x => x !== t) : [...arr, t]
    );
  }

  toggleAction(a: RoomAssignment['actionState']): void {
    this.selectedActions.update(arr =>
      arr.includes(a) ? arr.filter(x => x !== a) : [...arr, a]
    );
  }

  clearFilters(): void {
    this.selectedStatuses.set([]);
    this.selectedTasks.set([]);
    this.selectedActions.set([]);
  }

  applySort(value: string): void {
    this.selectedSort.set(value);
    this.sortPanelOpen.set(false);
  }

  ngOnInit(): void {
    this.hkService.getRooms().subscribe({
      next: data => {
        this.rooms.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
