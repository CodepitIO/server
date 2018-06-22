angular.module('General')
  .constant('Config', {
    ThrottleTime: 1000,
    RecaptchaKey: '6LemLCETAAAAACjlV0RyXtnlFyzSJcmmx4keyDsn',
    NotificationOptions: {
      delay: 5000,
      startTop: 20,
      startRight: 10,
      verticalSpacing: 20,
      horizontalSpacing: 20,
      positionX: 'right',
      positionY: 'bottom'
    },
    TooltipOptions: {
      'toggleContestAccessEvent': 'toggleContestAccessEvent'
    },
    Themes: {
      'default': {
        PrimaryPalette: {
          color: 'cyan'
        },
        AccentPalette: {
          color: 'blue-grey',
          opts: {
            'default': '400',
            'hue-1': '100',
            'hue-2': '600',
            'hue-3': '900'
          }
        },
        WarnPalette: {
          color: 'red'
        }
      },
      'progressBarTheme': {
        PrimaryPalette: {
          color: 'cyan',
          opts: {
            'default': '500'
          }
        },
        AccentPalette: {
          color: 'orange'
        },
        WarnPalette: {
          color: 'red'
        }
      }
    }
  });
