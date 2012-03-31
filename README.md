# jQuery-Pong
## Installation

Developers need a minimum of:

 - A text editor
 - [RequireJS v0.26.0][requirejs] or above.
 - [jQuery v1.6][jquery] or above.

## Usage

    <div id='someElement'></div>
    <script type='text/javascript'>
        require([
            'jquery-pong'
        ], function () {
            $.ready(function () {
                $('#someElement').pong();
            });
        });
    </script>

## Options

    {
        width: //  Pixel width of the court. (Default: Current CSS width)
        height: // Pixel height of the court. (Default: Current CSS height)

        targetSpeed: // Number of Miliseconds to wait, between redraws (Default: 30)

        ballAngle: // Angle the ball changes direction, when impacting a wall. (Default: 45)
        ballSpeed: // Number of pixels the ball can move per redraw. (Default: 8)
        ballWidth: // Pixel width of the ball. (Default: 14)
        ballHeight: // Pixel height of the ball. (Default: 14)
        roundBall: // Add CSS3 border to make the ball round. (Default: false)

        compSpeed: 5, // Number of pixels the Computer can move per redraw. (Default: 5)
        playerSpeed: 5, // Number of pixels the player can move per redraw. (Default: 5)

        difficulty: 5,
        playTo: 10, // Winning score. (Default: 10)

        paddleWidth: // Paddles width in pixels. (Default: 10)
        paddleHeight: // Paddles height in pixels. (Default: 40)
        paddleBuffer: // Paddles stopping distance from the court boundry in pixels. (Default: 1)

        fontSizes: {
            score // CSS font size (Default: 10em)
            results: // CSS font size (Default: 5em)
            cornerMrg: // CSS font size (Default: 1em)
        }

        courtSize: // Thickness of the border surrounding the court in Pixels. Also applies to the dividing line. (Default: 7)

        sounds: {
            wallImpact: // URL to sound file. Plays when a wall is impacted. (Default: false)
            paddleImpact: false, // URL to sound file. Plays when the Player or Computers paddle is impacted. (Default: false)
            score: false, // URL to sound file. Plays when the Player or Computer scores a point. (Default: false)
            win: false, // URL to sound file. Plays when the Player wins the game. (Default: false)
            loose: false // URL to sound file. Plays when the Player looses the game. (Default: false)
        }

        font: // CSS Font-Family used by all text in the game. (Default: "sans-serif")
        backgroundColor: // CSS background color for the court. (Default: '#000')
        foregroundColor: // CSS background color for the court. This includes the paddles and the court itself. (Default: '#fff')
    }

## Options Usage

    $('#someElement').pong({
        height: 300,
        width: 300,
        sounds: {
            wallImpact: './audio/wallImpact.wav'
        }
    });


[requirejs]: http://requirejs.org
[jquery]: http://jquery.com