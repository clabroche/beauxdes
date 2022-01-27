
const webpack = require('webpack')
module.exports = {
  context: __dirname + "/src",
  entry: "./index",
  output: {
    path: __dirname,
    filename: "extension.js",
    iife: false,
  },
  mode: 'development',
  devtool: "source-map",
  externals: {
    'gnome': 'global',
    'lang': 'imports.lang',
    'gi/meta': 'imports.gi.Meta',
    'gi/shell': 'imports.gi.Shell',
    'ui/main': 'imports.ui.main',
    'ui/popupMenu': 'imports.ui.popupMenu',
    'ui/panelMenu': 'imports.ui.panelMenu',
    'gi/atk': 'imports.gi.Atk',
    'gi/st': 'imports.gi.St',
    'gi/gtk': 'imports.gi.Gtk',
    'gi/gdk': 'imports.gi.Gdk',
    'gi/gobject': 'imports.gi.GObject',
    'gi/gio': 'imports.gi.Gio',
    'gi/soup': 'imports.gi.Soup',
    'gi/glib': 'imports.gi.GLib',
    'gi/clutter': 'imports.gi.Clutter',
    'misc/config': 'imports.misc.config',
    'me': 'imports.misc.extensionUtils.getCurrentExtension()'
  }

  // module: {
  //   rules: [
  //     {
  //       test: /\.m?js$/,
  //       exclude: /(node_modules|bower_components)/,
  //       use: {
  //         loader: 'babel-loader',
  //         options: {
  //           presets: ['@babel/preset-env']
  //         }
  //       }
  //     }
  //   ]
  // },
}