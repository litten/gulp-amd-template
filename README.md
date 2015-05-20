# gulp-amd-template

To compile templates into JS source code with AMD.

## Install 

Install with [npm](https://www.npmjs.org/package/gulp-amd-template)

```
npm install --save-dev gulp-amd-template
```

##Usage

```js
gulp.task('tpl', function(){
	gulp.src('source/tpl/'+'**/*.tpl')
		.pipe(template())
		.pipe(gulp.dest('dist'));
})
```


## Example

### source `demo.html`

```html
<%for(var i=0,len=list.length; i<len; i++){%>
	<li><%=list[i].name%></li>
	<%for(var em in list[i]){%>
		<%if(list[i][em] == "time"){%>
			<%var time = list[i][em]%>
			<p><%=time%></p>
		<%}%>
	<%}%>
<%}%>
```
Compile into

### `demo.js`
```js
(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else {
		root['demo'] = factory();
	}
} (this,
function() {
	return function(it, opt) {
		it = it || {};
		with(it) {
			var _$out_ = [];
			for (var i = 0,
			len = list.length; i < len; i++) {
				_$out_.push('<li>', list[i].name, '</li>');
				for (var em in list[i]) {
					if (list[i][em] == "time") {
						var time = list[i][em] _$out_.push('<p>', time, '</p>');
					}
				}
			}
			return _$out_.join('');
		}
	}
```

## Changelog

#### 1.0:
* **BREAKING**: Init Proj

## License

MIT © Emanuele Ingrosso