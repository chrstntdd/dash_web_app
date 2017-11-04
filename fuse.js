const {
  FuseBox,
  EnvPlugin,
  CSSPlugin,
  SVGPlugin,
  SassPlugin,
  PostCSSPlugin,
  QuantumPlugin,
  WebIndexPlugin,
  UglifyJSPlugin,
  CSSResourcePlugin,
  ImageBase64Plugin,
  Sparky
} = require('fuse-box');
const path = require('path');
const express = require('express');
const autoprefixer = require('autoprefixer');

const POSTCSS_PLUGINS = [
  require('postcss-flexibility'),
  autoprefixer({
    browsers: [
      'Chrome >= 52',
      'FireFox >= 44',
      'Safari >= 7',
      'Explorer 11',
      'last 4 Edge versions'
    ],
    grid: true
  })
];

let producer;
let isProduction = false;

Sparky.task('build', () => {
  const fuse = FuseBox.init({
    homeDir: './client',
    output: './dist/$name.js',
    log: true,
    hash: isProduction,
    sourceMaps: !isProduction,
    target: 'browser',
    experimentalFeatures: true,
    cache: !isProduction,
    tsConfig: './tsconfig.json',
    plugins: [
      [
        SassPlugin({
          outputStyle: 'compressed'
        }),
        PostCSSPlugin(POSTCSS_PLUGINS),
        CSSResourcePlugin({
          inline: true
        }),
        CSSPlugin({
          group: 'bundle.css',
          outFile: `./dist/bundle.css`
        })
      ],
      SVGPlugin(),
      WebIndexPlugin({
        template: './client/index.html',
        title: 'Dash Analytics'
      }),
      ImageBase64Plugin({
        useDefault: true
      }),
      isProduction &&
        QuantumPlugin({
          removeExportsInterop: false,
          bakeApiIntoBundle: 'vendor',
          uglify: true,
          treeshake: true
        })
    ]
  });

  /* Configure dev server */
  fuse.dev({ root: false, open: true }, server => {
    const dist = path.join(__dirname, '/dist');
    const app = server.httpServer.app;
    app.use(express.static(dist));
    app.get('*', (req, res) => {
      res.sendFile(path.join(dist, '/index.html'));
    });
  });

  /* Vendor dependencies */
  const vendor = fuse.bundle('vendor').instructions('~ index.tsx');
  if (!isProduction) {
    vendor.watch();
    vendor.hmr({ reload: true });
  }

  /* Main bundle */
  const app = fuse.bundle('app').instructions('!> [index.tsx]');
  if (!isProduction) {
    app.watch();
    app.hmr({ reload: true });
  }

  return fuse.run();
});

/* Build tasks */
Sparky.task('copy-favicons', () =>
  Sparky.src('./**/**.*', { base: './client/assets/favicons/' }).dest('./dist')
);
Sparky.task('copy-img', () =>
  Sparky.src('./**/**.*', { base: './client/assets/img/' }).dest('./dist')
);
Sparky.task('clean', () => Sparky.src('./dist/*').clean('./dist/'));
Sparky.task('set-production-env', () => (isProduction = true));

/* yarn start */
Sparky.task(
  'default',
  ['clean', 'build', 'copy-favicons', 'copy-img'],
  () => {}
);

/* yarn dist */
Sparky.task(
  'dist',
  [
    'clean',
    'set-production-env',
    'build',
    'copy-redirect',
    'copy-favicons',
    'copy-img'
  ],
  () => {}
);
