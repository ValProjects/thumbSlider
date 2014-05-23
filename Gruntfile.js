// Обязательная обёртка
module.exports = function(grunt) {

    // Задачи
    grunt.initConfig({
        // Склеиваем
        concat: {
            main: {
                src: [
                    'js/*.js',
                ],
                dest: 'build/scripts.js'
            }
        },
        concat_css: {
            options: {
                // Task-specific options go here.
            },
            all: {
                src: [
                    "css/*.css"
                ],
                dest: "build/styles.css"
            },
        },
        // Сжимаем
        uglify: {
            main: {
                files: {
                    // Результат задачи concat
                    'build/scripts.min.js': '<%= concat.main.dest %>'
                }
            }
        },
        cssmin: {
            combine: {
                files: {
                    'build/styles.min.css': 'build/styles.css'
                }
            }
        }
    });

    // Загрузка плагинов, установленных с помощью npm install
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concat-css');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // Задача по умолчанию
    grunt.registerTask('default', ['concat', 'concat_css', 'uglify', 'cssmin']);
};