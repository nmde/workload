import { select, Selection } from 'd3';
import { Assignment } from './Assignment';

type Day = {
  date: Date;
  row: number;
  column: number;
};

export class Calendar {
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

  public options = {
    borderColor: 'black',
    borderWidth: 1,
    dayWidth: 200,
    dayHeight: 200,
    padding: 8,
  };

  /**
   * Renders the calendar.
   * @param container - The element to render within.
   * @param data - Assignments to show.
   * @param year - The selected year.
   * @param month - The selected month.
   */
  public render(
    container: Selection<SVGElement, null, HTMLElement, undefined>,
    data: Assignment[],
    year: number,
    month: number,
  ) {
    const { dayWidth, dayHeight, padding } = this.options;
    container.selectAll('*').remove();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const { width } = container.node()?.getBoundingClientRect() as DOMRect;
    const daysPerRow = Math.floor(width / dayWidth);
    let currentCol = 0;
    let i = 0;
    const days: Day[][] = [[]];
    while (i < daysInMonth) {
      days[days.length - 1].push({
        date: new Date(year, month, i + 1),
        row: days.length - 1,
        column: currentCol,
      });
      currentCol += 1;
      if (currentCol >= daysPerRow) {
        currentCol = 0;
        days.push([]);
      }
      i += 1;
    }
    container.attr('height', days.length * dayHeight);
    const dayNodes = container
      .selectAll('g')
      .data(days)
      .enter()
      .selectAll('g')
      .data((row) => row)
      .enter()
      .append('g');
    dayNodes
      .append('rect')
      .attr('fill', 'transparent')
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
  }
}
