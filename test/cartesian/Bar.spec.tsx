import React, { ComponentType, ReactNode } from 'react';
import { describe, expect, test, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import uniqueId from 'lodash/uniqueId';
import {
  AreaChart,
  Bar,
  BarChart,
  ComposedChart,
  FunnelChart,
  Legend,
  LegendType,
  LineChart,
  PieChart,
  RadarChart,
  RadialBarChart,
  ScatterChart,
} from '../../src';

type TestCase = {
  ChartElement: ComponentType<{ children?: ReactNode; width?: number; height?: number }>;
  testName: string;
};

const chartsThatSupportBar: ReadonlyArray<TestCase> = [
  { ChartElement: ComposedChart, testName: 'ComposedChart' },
  { ChartElement: BarChart, testName: 'BarChart' },
];

const chartsThatDoNotSupportBar: ReadonlyArray<TestCase> = [
  { ChartElement: AreaChart, testName: 'AreaElement' },
  { ChartElement: LineChart, testName: 'LineChart' },
  { ChartElement: ScatterChart, testName: 'ScatterChart' },
  { ChartElement: PieChart, testName: 'PieChart' },
  { ChartElement: RadarChart, testName: 'RadarChart' },
  { ChartElement: RadialBarChart, testName: 'RadialBarChart' },
  { ChartElement: ScatterChart, testName: 'ScatterChart' },
  { ChartElement: FunnelChart, testName: 'FunnelChart' },
  // Treemap and Sankey do not accept children
  // { ChartElement: Treemap, testName: 'Treemap' },
  // { ChartElement: Sankey, testName: 'Sankey' },
];

const data = [
  { x: 10, y: 50, width: 20, height: 50, value: 100, label: 'test1' },
  { x: 50, y: 50, width: 20, height: 50, value: 200, label: 'test2' },
  { x: 90, y: 50, width: 20, height: 50, value: 300, label: 'test3' },
  { x: 130, y: 50, width: 20, height: 50, value: 400, label: 'test4' },
  { x: 170, y: 50, width: 20, height: 50, value: 500, label: 'test5' },
];

describe.each(chartsThatSupportBar)('<Bar /> as a child of $testName', ({ ChartElement }) => {
  it(`Render ${data.length} rectangles in horizontal Bar`, () => {
    const { container } = render(
      <ChartElement width={500} height={500}>
        <Bar isAnimationActive={false} layout="horizontal" data={data} dataKey="value" />
      </ChartElement>,
    );

    expect(container.querySelectorAll('.recharts-bar-rectangle')).toHaveLength(data.length);
  });

  it(`Render ${data.length} rectangles in vertical Bar`, () => {
    const { container } = render(
      <ChartElement width={500} height={500}>
        <Bar isAnimationActive={false} layout="vertical" data={data} dataKey="value" />
      </ChartElement>,
    );

    expect(container.querySelectorAll('.recharts-bar-rectangle')).toHaveLength(data.length);
  });

  it("Don't render any rectangle when data is empty", () => {
    const { container } = render(
      <ChartElement width={500} height={500}>
        <Bar data={[]} dataKey="value" />
      </ChartElement>,
    );

    expect(container.querySelectorAll('.recharts-bar-rectangle')).toHaveLength(0);
  });

  describe('With background', () => {
    const composedDataWithBackground = [
      {
        x: 10,
        y: 50,
        width: 20,
        height: 20,
        value: 40,
        label: 'test',
        background: { x: 10, y: 50, width: 20, height: 50 },
      },
      {
        x: 50,
        y: 50,
        width: 20,
        height: 50,
        value: 100,
        label: 'test',
        background: { x: 50, y: 50, width: 20, height: 50 },
      },
    ];

    it('Will create a background Rectangle with the passed in props', () => {
      const { container } = render(
        <ChartElement width={500} height={500}>
          <Bar data={composedDataWithBackground} background={{ fill: '#000' }} dataKey="value" />
        </ChartElement>,
      );

      expect(container.querySelectorAll('.recharts-bar-background-rectangle')).toHaveLength(
        composedDataWithBackground.length,
      );
    });

    it('Will accept a function for the background prop', () => {
      const className = 'test-custom-background';
      const backgroundComponent = () => {
        return <div key={uniqueId()} className={className} />;
      };
      const { container } = render(
        <ChartElement width={500} height={500}>
          <Bar data={composedDataWithBackground} background={backgroundComponent} dataKey="value" />
        </ChartElement>,
      );

      expect(container.querySelectorAll(`.${className}`)).toHaveLength(composedDataWithBackground.length);
    });

    it('should pass props to the custom background function', () => {
      const expectedProps = {
        className: 'recharts-bar-background-rectangle',
        dataKey: 'value',
        fill: '#eee',
        height: 50,
        index: expect.any(Number),
        label: 'test',
        onAnimationEnd: expect.any(Function),
        onAnimationStart: expect.any(Function),
        width: 20,
        x: expect.any(Number),
        y: 50,
      };
      const backgroundComponent = props => {
        expect.soft(props).toEqual(expectedProps);
        return <></>;
      };
      render(
        <ChartElement width={500} height={500}>
          <Bar data={composedDataWithBackground} background={backgroundComponent} dataKey="value" />
        </ChartElement>,
      );
    });
  });

  describe('label', () => {
    describe('as boolean', () => {
      it('should draw default labels when label = true', () => {
        const { container } = render(
          <ChartElement width={500} height={500}>
            <Bar isAnimationActive={false} data={data} label dataKey="value" />
          </ChartElement>,
        );
        const labels = container.querySelectorAll('.recharts-text.recharts-label');
        expect(labels).toHaveLength(data.length);
        labels.forEach(l => {
          expect(l).toHaveAttribute('x', expect.any(String));
          expect(l).toHaveAttribute('y', '75');
          expect(l).toHaveAttribute('height', '50');
          expect(l).toHaveAttribute('offset', '5');
          expect(l).toHaveAttribute('text-anchor', 'middle');
          expect(l).toHaveAttribute('width', '20');
          expect(l).toHaveAttribute('fill', '#808080');
        });
      });

      it('should not draw labels while animating', () => {
        const { container } = render(
          <ChartElement width={500} height={500}>
            <Bar isAnimationActive data={data} label dataKey="value" />
          </ChartElement>,
        );
        const labels = container.querySelectorAll('.recharts-text.recharts-label');
        expect(labels).toHaveLength(0);
      });

      it('should not draw labels when label = false', () => {
        const { container } = render(
          <ChartElement width={500} height={500}>
            <Bar isAnimationActive={false} data={data} label={false} dataKey="value" />
          </ChartElement>,
        );
        const labels = container.querySelectorAll('.recharts-text.recharts-label');
        expect(labels).toHaveLength(0);
      });
    });

    describe('as svg properties object', () => {
      it('should draw labels and add extra props from the object', () => {
        const { container } = render(
          <ChartElement width={500} height={500}>
            <Bar
              isAnimationActive={false}
              data={data}
              label={{
                fill: 'red',
                elevation: 9,
              }}
              dataKey="value"
            />
          </ChartElement>,
        );
        const labels = container.querySelectorAll('.recharts-text.recharts-label');
        expect(labels).toHaveLength(data.length);
        labels.forEach(l => {
          expect(l).toHaveAttribute('x', expect.any(String));
          expect(l).toHaveAttribute('y', '75');
          expect(l).toHaveAttribute('height', '50');
          expect(l).toHaveAttribute('offset', '5');
          expect(l).toHaveAttribute('text-anchor', 'middle');
          expect(l).toHaveAttribute('width', '20');
          expect(l).toHaveAttribute('fill', 'red');
          expect(l).toHaveAttribute('elevation', '9');
        });
      });

      it('should overwrite the recharts-label className but keep recharts-text className', () => {
        const { container } = render(
          <ChartElement width={500} height={500}>
            <Bar
              isAnimationActive={false}
              data={data}
              label={{
                className: 'my-test-class',
              }}
              dataKey="value"
            />
          </ChartElement>,
        );
        const labels = container.querySelectorAll('.recharts-text.recharts-label');
        expect(labels).toHaveLength(0);
        const customLabels = container.querySelectorAll('.my-test-class');
        expect(customLabels).toHaveLength(data.length);
        customLabels.forEach(l => {
          expect(l).toHaveAttribute('class', 'recharts-text my-test-class');
        });
      });
    });

    describe('as function', () => {
      it('should pass props to the function', () => {
        const spy = vi.fn().mockReturnValue(null);
        render(
          <ChartElement width={500} height={500}>
            <Bar isAnimationActive={false} data={data} label={spy} dataKey="value" />
          </ChartElement>,
        );
        expect(spy).toHaveBeenCalledTimes(data.length);
        expect(spy).toBeCalledWith(
          {
            content: spy,
            height: 50,
            index: expect.any(Number),
            offset: 5,
            parentViewBox: undefined,
            textBreakAll: undefined,
            value: expect.any(Number),
            viewBox: {
              height: 50,
              width: 20,
              x: expect.any(Number),
              y: 50,
            },
            width: 20,
            x: expect.any(Number),
            y: 50,
          },
          {}, // this object arrives as a second argument, I am not sure where that comes from
        );
      });

      it('should render what the function returned', () => {
        const labelFn = () => <g className="my-mock-class" />;
        const { container } = render(
          <ChartElement width={500} height={500}>
            <Bar isAnimationActive={false} data={data} label={labelFn} dataKey="value" />
          </ChartElement>,
        );
        const labels = container.querySelectorAll('.my-mock-class');
        expect(labels).toHaveLength(data.length);
        labels.forEach(l => {
          expect.soft(l).not.toHaveAttribute('x');
          expect.soft(l).not.toHaveAttribute('y');
          expect.soft(l).not.toHaveAttribute('height');
          expect.soft(l).not.toHaveAttribute('offset');
          expect.soft(l).not.toHaveAttribute('text-anchor');
          expect.soft(l).not.toHaveAttribute('width');
          expect.soft(l).not.toHaveAttribute('fill');
        });
      });
    });

    describe('as a custom Element', () => {
      it(`should render what the function returned, and then inject extra sneaky props in it 
                - but not all of them, and not the same as in the other ways of rendering labels`, () => {
        const MyLabel = <g className="my-mock-class" />;
        const { container } = render(
          <ChartElement width={500} height={500}>
            <Bar isAnimationActive={false} data={data} label={MyLabel} dataKey="value" />
          </ChartElement>,
        );
        const labels = container.querySelectorAll('.my-mock-class');
        expect(labels).toHaveLength(data.length);
        labels.forEach(l => {
          expect.soft(l).toHaveAttribute('x', expect.any(String));
          expect.soft(l).toHaveAttribute('y', '50'); // this number is different from the other renders - not sure why
          expect.soft(l).toHaveAttribute('height', '50');
          expect.soft(l).toHaveAttribute('offset', '5');
          expect.soft(l).not.toHaveAttribute('text-anchor', 'middle');
          expect.soft(l).toHaveAttribute('width', '20');
          expect.soft(l).not.toHaveAttribute('fill', '#808080');
        });
      });
    });
  });

  describe('legendType', () => {
    const allLegendTypesExceptNone: ReadonlyArray<LegendType> = [
      'circle',
      'cross',
      'diamond',
      'line',
      'plainline',
      'rect',
      'square',
      'star',
      'triangle',
      'wye',
    ];

    test.each(allLegendTypesExceptNone)('should render legendType %s', legendType => {
      const { container } = render(
        <ChartElement width={500} height={500}>
          <Bar data={data} dataKey="value" legendType={legendType} />
          <Legend />
        </ChartElement>,
      );
      const legendIcon = container.querySelectorAll('.recharts-legend-item-text');
      expect(legendIcon).toHaveLength(1);
    });

    it('should not render any legend if legendType = none', () => {
      const { container } = render(
        <ChartElement width={500} height={500}>
          <Bar data={data} dataKey="value" legendType="none" />
          <Legend />
        </ChartElement>,
      );
      const legendIcon = container.querySelectorAll('.recharts-legend-item-text');
      expect(legendIcon).toHaveLength(0);
    });
  });
});

describe.each(chartsThatDoNotSupportBar)('<Bar /> as a child of $testName', ({ ChartElement }) => {
  it('should not render anything', () => {
    const { container } = render(
      <ChartElement width={500} height={500}>
        <Bar isAnimationActive={false} layout="horizontal" data={data} dataKey="value" data-testid="customized-bar" />
      </ChartElement>,
    );

    expect(container.querySelectorAll('.recharts-bar-rectangle')).toHaveLength(0);
  });
});
