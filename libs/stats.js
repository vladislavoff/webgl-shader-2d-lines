/**
 * @author mrdoob / http://mrdoob.com/
 * @author https://github.com/crobi/stats.js
 * @author cola_colin, added the functionality to get the busy time, which is
 *         not used in this example for 2D line drawing
 */

var Stats = function() {

	function getTime() {
		return performance ? (performance.now()) : (Date.now());
	}

	var startTime = getTime(), prevTime = startTime;
	var ms = 0, msMin = Infinity, msMax = 0;
	var fps = 0, fpsMin = Infinity, fpsMax = 0;
	var frames = 0, mode = 0;
	var lastFps = 0;
	var lastMs = 0;

	var container = document.createElement('div');
	container.id = 'stats';
	container.addEventListener('mousedown', function(event) {
		event.preventDefault();
		setMode(++mode % 2)
	}, false);
	container.style.cssText = 'width:100px;opacity:0.9;cursor:pointer';

	var fpsDiv = document.createElement('div');
	fpsDiv.id = 'fps';
	fpsDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#002';
	container.appendChild(fpsDiv);

	var fpsText = document.createElement('div');
	fpsText.id = 'fpsText';
	fpsText.style.cssText = 'color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
	fpsText.innerHTML = 'FPS';
	fpsDiv.appendChild(fpsText);

	var fpsGraph = document.createElement('div');
	fpsGraph.id = 'fpsGraph';
	fpsGraph.style.cssText = 'position:relative;width:94px;height:30px;background-color:#0ff';
	fpsDiv.appendChild(fpsGraph);

	while (fpsGraph.children.length < 94) {

		var bar = document.createElement('span');
		bar.style.cssText = 'width:1px;height:30px;float:left;background-color:#113';
		fpsGraph.appendChild(bar);

	}

	var msDiv = document.createElement('div');
	msDiv.id = 'ms';
	msDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#020;display:none';
	container.appendChild(msDiv);

	var msText = document.createElement('div');
	msText.id = 'msText';
	msText.style.cssText = 'color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
	msText.innerHTML = 'MS';
	msDiv.appendChild(msText);

	var msGraph = document.createElement('div');
	msGraph.id = 'msGraph';
	msGraph.style.cssText = 'position:relative;width:94px;height:30px;background-color:#0f0';
	msDiv.appendChild(msGraph);

	while (msGraph.children.length < 94) {

		var bar = document.createElement('span');
		bar.style.cssText = 'width:1px;height:30px;float:left;background-color:#131';
		msGraph.appendChild(bar);

	}

	var setMode = function(value) {

		mode = value;

		switch (mode) {

		case 0:
			fpsDiv.style.display = 'block';
			msDiv.style.display = 'none';
			break;
		case 1:
			fpsDiv.style.display = 'none';
			msDiv.style.display = 'block';
			break;
		}

	};

	var updateGraph = function(dom, value) {

		var child = dom.appendChild(dom.firstChild);
		child.style.height = value + 'px';

	};

	return {

		REVISION : 12,

		domElement : container,

		setMode : setMode,

		begin : function() {

			startTime = getTime();

		},

		end : function() {

			var time = getTime();

			ms += time - startTime;
			msMin = Math.min(msMin, ms);
			msMax = Math.max(msMax, ms);

			frames++;

			if (time > prevTime + 1000) {

				lastMs = (ms / frames).toFixed(2);
				msText.textContent = lastMs + ' MS (' + msMin.toFixed(0) + '-' + msMax.toFixed(0) + ')';
				updateGraph(msGraph, Math.min(30, Math.max(1, 30 - (ms / frames / 200) * 30)));

				fps = Math.round((frames * 1000) / (time - prevTime));
				fpsMin = Math.min(fpsMin, fps);
				fpsMax = Math.max(fpsMax, fps);

				lastFps = fps;

				fpsText.textContent = fps.toFixed(1) + ' FPS (' + fpsMin.toFixed(0) + '-' + fpsMax.toFixed(0) + ')';
				updateGraph(fpsGraph, Math.min(30, Math.max(1, 30 - (fps / 100) * 30)));

				prevTime = time;
				frames = 0;
				ms = 0;

			}

			return time;

		},

		getBusyTime : function() {
			return lastFps * lastMs;
		},

		update : function() {
			startTime = this.end();
		}
	}
};

if (typeof module === 'object') {
	module.exports = Stats;
}