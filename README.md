# jQuery-Pong



## Installation

Developers need a minimum of:

 - A text editor (my personal choice is [Sublime Text 2][sublime])
 - [RequireJS v0.26.0][requirejs] or above.
 - [jQuery v1.6][jquery] or above.

## Usage

    <div id='someElement'></div>
    <script type='text/javascript'>
        require([
            'pong'
        ], function () {
            $.ready(function () {
                $('#someElement').pong({
                    height: 550,
                    width: 780,
                    difficulty: 2,
                    ballSpeed: 15,
                    compSpeed: 9,
                    playerSpeed: 9,
                    paddleHeight: 50,
                    backgroundColor: 'transparent',
                    sounds: {
                        wallImpact: '/audio/wallImpact.wav',
                        paddleImpact: '/audio/paddleImpact.wav',
                        score: false
                    },
                    font: 'Visitor, monospace'
                });
            });
        });
    </script>


[sublime]: http://www.sublimetext.com/2
[requirejs]: http://requirejs.org
[jquery]: http://jquery.com