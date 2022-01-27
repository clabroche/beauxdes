

import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import cleanup from 'rollup-plugin-cleanup';

const globals = {
  '@imports/gio2': 'imports.gi.Gio',
  '@imports/gdk4': 'imports.gi.Gdk',
  '@imports/gtk4': 'imports.gi.Gtk',
  '@imports/gdkpixbuf2': 'imports.gi.GdkPixbuf',
  '@imports/glib2': 'imports.gi.GLib',
  '@imports/st1': 'imports.gi.St',
  '@imports/shell0': 'imports.gi.Shell',
  '@imports/meta9': 'imports.gi.Meta',
  '@imports/soup2': 'imports.gi.Soup',
  '@imports/gobject2': 'imports.gi.GObject',
};

const external = Object.keys(globals);

export default [
  {
    input: 'src/index.js',
    treeshake: {
      moduleSideEffects: 'no-external'
    },
    output: {
      file: `./extension.js`,
      format: 'iife',
      name: 'init',
      exports: 'default',
      globals,
      assetFileNames: "[name][extname]",
    },
    external,
    plugins: [
      commonjs(),
      nodeResolve({
        preferBuiltins: false,
      }),
      cleanup({
        comments: 'none'
      }),
    ],
  },
];
