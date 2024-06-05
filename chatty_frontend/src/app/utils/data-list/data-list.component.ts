import { AfterContentInit, ChangeDetectorRef, Component, ContentChild, ContentChildren, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, SimpleChanges, TemplateRef } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';

export enum DataListAlignment {
    LEFT = 'LEFT',
    RIGHT = 'RIGHT'
}

interface ListState {
    pending: boolean;
    hasListEntries: boolean;
}

export interface DataListColumn {
    widthInPercent: number;
    headerText: string;
}

export interface RowAttributes {
    isHoverable?: boolean;
    isClickable?: boolean;
    isDisabled?: boolean;
    isSelected?: boolean;
}

@Component({
    selector: 'app-data-list',
    templateUrl: './data-list.component.html',
    styleUrls: ['./data-list.component.scss']
})
export class DataListComponent<T> implements OnInit, AfterContentInit, OnChanges, OnDestroy {

    @Input() public columns: DataListColumn[] = [];

    @Input() public baseQuery!: Observable<T[]>;

    @Input() public rowAttributes: (rowData: any, rowIndex: number) => RowAttributes = (): RowAttributes =>
        ({ isHoverable: false, isClickable: false, isDisabled: false, isSelected: false });

    @Input() public paginateable: boolean = false; // TODO: Implement pagination

    @Output() public readonly rowClickAction = new EventEmitter<{ data: T, index: number }>();

    @Output() public readonly listClickOutside = new EventEmitter<void>();

    @ContentChild('row', { read: TemplateRef }) public rowTemplateRef!: TemplateRef<any>;

    @ContentChildren('column', { read: TemplateRef }) public columnTemplateRefs!: QueryList<TemplateRef<any>>;

    @ContentChildren('extraContent', { read: TemplateRef }) public extraContentTemplateRefs!: QueryList<TemplateRef<any>>;

    public data$ = new BehaviorSubject<any | null>(null);

    public listState: ListState = { pending: true, hasListEntries: false };

    constructor(
        public readonly cdRef: ChangeDetectorRef,
        private readonly fb: NonNullableFormBuilder
    ) { }

    public ngOnInit(): void {
        this.refreshData();
    }

    public ngAfterContentInit(): void {
        if (this.columns.map(columnData => columnData.widthInPercent).reduce((sum, curr) => sum + curr, 0) !== 100) {
            throw new Error('The sum of all column widths must be 100');
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {

    }

    public ngOnDestroy(): void {

    }

    public rowTrackBy = (index: number, obj: any): any =>
        index;

    public refreshData(): void {
        setTimeout(() => {
            this.refreshNonPaginatedData()
        }, 0);
    }

    public getColumnTemplatesForRow(rowIdx: number): TemplateRef<any>[] {
        const templatesForRow = this.columnTemplateRefs.filter(templateRef =>
            (templateRef.elementRef.nativeElement as HTMLElement).parentElement?.getAttribute('rowIdx') === rowIdx.toString()
        );
        return templatesForRow;
    }

    public getExtraContentTemplatesForRow(rowIdx: number): TemplateRef<any>[] {
        const templatesForRow = this.extraContentTemplateRefs.filter(templateRef =>
            (templateRef.elementRef.nativeElement as HTMLElement).parentElement?.getAttribute('rowIdx') === rowIdx.toString()
        );
        return templatesForRow;
    }

    public get shouldHaveHeaderRow(): boolean {
        return this.columns.some(column => column.headerText !== '');
    }

    private refreshNonPaginatedData(): void {
        this.listState.pending = true;
        this.baseQuery.subscribe(data => {
            this.data$.next(data);
            this.listState.pending = false;
            this.listState.hasListEntries = data.length > 0;
            this.cdRef.detectChanges();

        });
    }


}
