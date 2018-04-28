//Grunt config
module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            build: {
                files: [{
                    cwd     : 'app/',
                    src     : '**/*.js',
                    dest    : 'build/',
                    expand  : true,
                    flatten : false,
                    ext     : '.min.js',
                    'build/server.min.js' : ['./server.js']
                    }]
                }
            },
        beautify: {
            files: ["app/**/*.js" , "server.js" , "app/**/*.css" , "build/**/*.html"],
            options: {
                js: {
                    indentSize: 2,
                    indent_char: " ",
                    indent_level: 0,
                    indent_with_tabs: false,
                    preserve_newlines: true,
                    max_preserve_newlines: 10,
                    jslint_happy: false,
                    brace_style: "collapse",
                    keep_array_indentation: false,
                    keep_function_indentation: false,
                    space_before_conditional: true,
                    break_chained_methods: false,
                    unescape_strings: false,
                    wrap_line_length: 0
                },
                css: {
                    indentSize: 2,
                    indent_char: " ",
                    indent_level: 0,
                    indent_with_tabs: false,
                    end_with_newline: true,
                },
                html: {
                    indentSize: 2,
                    indent_char: " ",
                    indent_level: 0,
                    indentScripts: "keep",
                    indent_with_tabs: false,
                    end_with_newline: true,
                    braceStyle: "collapse",
                    maxPreserveNewlines: 10,
                    preserveNewlines: true,
                    wrapLineLength: 0
                },
            },
        },
        trimtrailingspaces: {
            main: {
                src : ['<%= beautify.files %>'],
                options: {
                    filter: 'isFile',
                    encoding: 'utf8',
                    failIfTrimmed: false
                }
            }
        },
        lineending: {
            dist: {
                options: {
                    overwrite: true
                },
                files: {
                    '': ['<%= beautify.files %>']
                }
            }
        },

      });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-lineending');
    grunt.loadNpmTasks("grunt-trimtrailingspaces");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-pug");
    grunt.loadNpmTasks("gruntify-eslint");

    grunt.registerTask('default', [ 'uglify' , 'beautify', 'lint' , 'clean']);
};
