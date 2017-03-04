var path = require('path');

module.exports  = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        webpack: {
            options: {
                resolve: {
                    extensions: ['.js', '.jsx'],
                    modules: [
                        path.resolve('./src/js'),
                        path.resolve('./src/'),
                        path.resolve('./node_modules/')
                    ]
                },
                module: {
                    loaders: [
                        {
                            test: /.jsx?$/,
                            loader: 'babel-loader',
                            exclude: /node_modules/,
                            query: {
                                presets: ['es2015', 'react']
                            }
                        }
                    ]
                }
            },
            build: {
                entry: './src/js/index.js',
                output: {
                    path: __dirname,
                    filename: 'build/js/app.js'
                }
            },
            dist: {
            }
        },
        browserSync: {
            build: {
                options: {
                    watchTask: true,
                    server: './build',
                    plugins: [
                        {
                            module: "bs-html-injector",
                            options: {
                                files: "./build/*.html"
                            }
                        }
                    ]
                }
            }
        },

        bsReload: {
            css: "css/app.css"
        },

        less: {
            build: {
                files: {
                    'build/css/app.css': ['src/less/app.less']
                }
            },
            dist: {
                files: {
                    'dist/css/app.css': ['src/less/app.less']
                }

            }

        },

        cssmin: {
            dist: {
                files: {
                    'dist/css/app.css': ['build/css/app.css']
                }

            }
        },

        watch   : {
            options: {
                spawn: false,
            },

            mock_data : {
                files : ['./src/*.json'],
                tasks : ['webpack:build', 'watch']
            },
            js_src : {
                files : ['./src/js/**/*.js', './src/views/**/*.jsx'],
                tasks : ['webpack:build', 'watch']
            },
            html_src: {
                files: ['./src/*.html', './src/*.ico'],
                tasks : ['copy:build', 'watch']
            },
            styles : {
                files : ['./src/less/**/*'],
                tasks : ['less:build', 'watch']
            }
        },

        copy: {
            build: {
                files: [
                    {expand: true, cwd: 'src', src: [ 'manifest.json', 'index.html', 'favicon.ico', 'tag.json', 'geofence.json', 'poi.json', 'animal.json', 'label.json', 'device_message.json'], dest: 'build/', filter: 'isFile'},
                    {expand: true, cwd: 'src', src: ['img/**'], dest: 'build/', filter: 'isFile'}
                ]
            },
            dist: {
                files: [
                    {expand: true, cwd: 'src', src: [ 'manifest.json', 'index.html', 'favicon.ico', 'tag.json', 'geofence.json', 'poi.json', 'animal.json', 'label.json', 'device_message.json'], dest: 'dist/', filter: 'isFile'},
                    {expand: true, cwd: 'src', src: ['img/**'], dest: 'dist/', filter: 'isFile'},
                    {expand: true, cwd: 'build', src: ['js/app.js'], dest: 'dist/', filter: 'isFile'}
                ],
            }
        },

        clean: ["build", "dist"],

    });

    grunt.registerTask('build', ['webpack:build',
                                 'less:build',
                                 'copy:build']);
    grunt.registerTask('dist', ['clean',
                                'webpack:build',
                                'less:build',
                                'cssmin:dist',
                                'copy:dist']);
    grunt.registerTask('default', ['build',
                                   'browserSync',
                                   'watch']);
};
