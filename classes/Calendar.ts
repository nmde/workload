import { Selection } from 'd3';
import { EventEmitter } from 'ee-ts';
import { Assignment } from './Assignment';
import { Category } from './Category';

type Day = {
  date: Date;
  row: number;
  column: number;
};

export class Calendar extends EventEmitter<{
  dayClicked: (date: Date) => void;
  assignmentClicked: (assignment: Assignment) => void;
}> {
  public static months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  private assignmentContainer!: Selection<
    SVGGElement,
    null,
    HTMLElement,
    unknown
  >;

  private categories: Category[] = [];

  private dayMap: Record<number, Record<number, Record<number, Day>>> = {};

  public options = {
    borderColor: 'black',
    borderWidth: 1,
    dayWidth: 200,
    dayHeight: 200,
    maxAssignmentHeight: 100,
    padding: 8,
  };

  /**
   * Creates an assignment element.
   * @param assignment - The assignment data.
   * @param startCol - The starting column.
   * @param endCol - The ending column.
   * @param row - The row.
   */
  private createAssignment(
    assignment: Assignment,
    startCol: number,
    endCol: number,
    row: number,
  ) {
    const category = this.categories.find(
      (v) => v.data.name === assignment.data.category,
    );
    this.assignmentContainer
      .append('rect')
      .attr('fill', category?.data.color || 'black')
      .attr('x', () => startCol * this.options.dayWidth)
      .attr('y', () => row * this.options.dayHeight)
      .attr('height', assignment.data.weight * this.options.maxAssignmentHeight)
      .attr(
        'width',
        () => endCol * this.options.dayWidth - startCol * this.options.dayWidth,
      )
      .on('click', () => {
        this.emit('assignmentClicked', assignment);
      });
  }

  /**
   * Shortcut for getting the mapped day from a date.
   * @param date - The date to get.
   * @returns The day data.
   */
  private getMappedDay(date: Date) {
    return this.dayMap[date.getFullYear()][date.getMonth()][date.getDate()];
  }

  /**
   * Renders the calendar.
   * @param container - The element to render within.
   * @param data - Assignments to show.
   * @param year - The selected year.
   * @param month - The selected month.
   */
  public render(
    container: Selection<SVGElement, null, HTMLElement, undefined>,
    assignments: Assignment[],
    categories: Category[],
    year: number,
    month: number,
  ) {
    this.categories = categories;
    const { dayWidth, dayHeight, padding } = this.options;
    container.selectAll('*').remove();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const { width } = container.node()?.getBoundingClientRect() as DOMRect;
    const daysPerRow = Math.floor(width / dayWidth);
    let currentCol = 0;
    let i = 0;
    const days: Day[][] = [[]];
    while (i < daysInMonth) {
      const date = new Date(year, month, i + 1);
      const day = {
        date,
        row: days.length - 1,
        column: currentCol,
      };
      days[days.length - 1].push(day);
      if (!this.dayMap[year]) {
        this.dayMap[year] = {};
      }
      if (!this.dayMap[year][month]) {
        this.dayMap[year][month] = {};
      }
      this.dayMap[year][month][i + 1] = day;
      currentCol += 1;
      if (currentCol >= daysPerRow) {
        currentCol = 0;
        days.push([]);
      }
      i += 1;
    }
    container.attr('height', days.length * dayHeight);
    const dayNodes = container
      .append('g')
      .selectAll('g')
      .data(days)
      .enter()
      .selectAll('g')
      .data((row) => row)
      .enter()
      .append('g')
      .on('click', (_event, d) => {
        this.emit('dayClicked', d.date);
      });
    dayNodes
      .append('rect')
      .attr('fill', (d) => {
        const today = new Date();
        if (
          d.date.getFullYear() === today.getFullYear() &&
          d.date.getMonth() === today.getMonth() &&
          d.date.getDate() === today.getDate()
        ) {
          return 'rgba(55,0,179,0.3)';
        }
        return 'transparent';
      })
      .attr('stroke', this.options.borderColor)
      .attr('stroke-width', this.options.borderWidth)
      .attr('x', (d) => d.column * this.options.dayWidth)
      .attr('y', (d) => d.row * this.options.dayHeight)
      .attr('width', this.options.dayWidth)
      .attr('height', this.options.dayHeight);
    dayNodes
      .append('text')
      .text((d) => d.date.getDate())
      .attr('x', (d) => d.column * this.options.dayWidth + padding)
      .attr('y', function (d) {
        return d.row * dayHeight + this.getBBox().height + padding;
      });
    this.assignmentContainer = container.append('g');
    assignments.forEach((d) => {
      const { row: startRow, column: startCol } = this.getMappedDay(
        d.startDate,
      );
      const { row: endRow, column: endCol } = this.getMappedDay(d.endDate);
      if (startRow === endRow) {
        this.createAssignment(d, startCol, endCol + 1, startRow);
      } else {
        this.createAssignment(d, startCol, daysPerRow, startRow);
        for (let row = startRow + 1; row < endRow; row += 1) {
          this.createAssignment(d, 0, daysPerRow, row);
        }
        this.createAssignment(d, 0, endCol + 1, endRow);
      }
    });
  }
}
