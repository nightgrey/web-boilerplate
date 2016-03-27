# web-boilerplate

This is my personal boilerplate for developing normal, boring, static websites. This doesn't mean you can't use it - in fact, you're free to do so if you happen to like it. I, by no means, call this 'complete'. It's merely a quick starting point for my projects, flexible enough to build anything I need - and easy enough to use without much explanation.

I may add, change and break things in the future. You were warned.

## Technologies used

* [Webpack](https://webpack.github.io/)
* [Gulp](http://gulpjs.com/) (Aren't NPM scripts better? Well.. [no](https://twitter.com/jaffathecake/status/700320306053935104).)
* [Babel](https://babeljs.io/)
* [SASS](http://sass-lang.com/)
* [ESLint](http://eslint.org/) with the [AirBnB configuration](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb)
* [EJS](http://ejs.co/)
* [Browsersync](https://www.browsersync.io/)

Also, everything is modularized to keep it self-contained and re-usable. FREE MODULES FOR EVERYONE!

## When do you finally stop talking and show me how to use this shit?

Ok, ok. Easy, easy. It's breathtakingly simple.

**First, install the dependencies (who whould've expected this?)**

```bash
npm install
```

**.. then start hacking away**:

```bash
gulp build:watch
```

As soon as you do this, your default browser opens with the compiled HTML/CSS/JS. Now simply start developing - everything will be hot-swapped on the fly. Cool, hm? And because we're using Browsersync, every scrolling and mouse click will be synchronized with all devices which have this page open. Magic.

To access other page templates besides ``index.ejs``, access ``/<filename>.html``.

You can create as many templates as you want, but remember defining them in the webpack plugin configuration. Check out ``webpack.config.babel.js`` to learn more - it's basically self-explaining. Just repeat what's already there for every template you create.

**.. and then, as soon as you want production-ready code:**

```bash
gulp build
```

*Kaboom!*

## Why do you even use Gulp?

If you've checked my gulpfile, this question probably crossed your mind. I used it in the start, thinking I don't need webpack - well, I was wrong. I then slowly adopted webpack, calling it with via the nodejs API within Gulp. I slowly removed every Gulp task I replaced with the webpack equivalent until, in the end, I saw I didn't need any Gulp tasks at all.

Despite all this it's still useful as I'm passing true/false depending on if it's ``gulp build`` or ``gulp build:watch`` to turn off/on some plugins/modules/settings. Yes, I know I also could've done this without Gulp.

.. and now leave me alone!

## License

WTFPL (http://www.wtfpl.net/)


