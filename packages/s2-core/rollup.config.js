import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import { visualizer } from 'rollup-plugin-visualizer';
import ttypescript from 'ttypescript';

// TODO: 拆包完成后，简化 core 层打包逻辑
const format = process.env.FORMAT;
const enableAnalysis = process.env.ANALYSIS;

const OUT_DIR_NAME_MAP = {
  esm: 'esm',
  cjs: 'lib',
  umd: 'dist',
};

const outDir = OUT_DIR_NAME_MAP[format];
const isEsmFormat = format === 'esm';

const output = {
  format: format,
  exports: 'named',
  name: 'S2',
  sourcemap: true,
};

const plugins = [
  alias({
    entries: [
      { find: 'lodash', replacement: 'lodash-es' },
      {
        find: 'react-is',
        replacement: 'react-is/cjs/react-is.production.min.js',
      },
    ],
  }),
  replace({
    'process.env.NODE_ENV': JSON.stringify('production'),
    preventAssignment: true,
  }),
  commonjs(),
  resolve(),
  typescript({
    outDir: outDir,
    abortOnError: true,
    tsconfig: 'tsconfig.json',
    tsconfigOverride: {
      exclude: ['__tests__'],
      compilerOptions: {
        declaration: isEsmFormat,
      },
    },
    typescript: ttypescript,
  }),
  postcss({
    minimize: true,
    use: {
      sass: null,
      stylus: null,
      less: { javascriptEnabled: true },
    },
    extract: true,
    output: outDir + '/s2.min.css',
  }),
];

if (enableAnalysis) {
  plugins.push(visualizer({ gzipSize: true }));
}

const external = ['react', 'react-dom', '@ant-design/icons', /antd/];

if (format === 'umd') {
  output.file = 'dist/s2.min.js';
  plugins.push(terser());
  output.globals = {
    react: 'React',
    'react-dom': 'ReactDOM',
    antd: 'antd',
    '@ant-design/icons': 'icons',
  };
} else {
  external.push(
    'd3-interpolate',
    'lodash',
    'lodash-es',
    '@antv/g-gesture',
    '@antv/g-canvas',
    '@antv/event-emitter',
    'd3-timer',
    'classnames',
  );
  output.dir = outDir;
}

// eslint-disable-next-line import/no-default-export
export default {
  input: 'src/index.ts',
  output,
  external,
  plugins,
};
