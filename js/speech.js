var start_button = document.getElementById('start_button'),
	recognizing = false,
	final_transcript = '';
var editable_elements = document.querySelectorAll("[contenteditable=false]");

function edit() {
	editable_elements[0].setAttribute("contentEditable", true);
	start_button.style.display = "block";
};

if (!('webkitSpeechRecognition' in window || 'speechRecognition' in window)) {

	start_button.style.display = "none";

} else {
	var speechRecognition =  webkitSpeechRecognition || speechRecognition;
	var recognition = new speechRecognition();

	recognition.lang = 'en';
	recognition.continuous = true;
	recognition.interimResults = true;
	recognition.onstart = function () {

		recognizing = true;
		start_button.classList.add('animated');
	};

	recognition.onerror = function (event) {
		if (event.error == 'no-speech') {
			start_button.remove('animated');
		}
		if (event.error == 'audio-capture') {
			start_button.remove('animated');
		}
	};

	recognition.onend = function () {
		recognizing = false;
		start_button.remove('animated');
	};

	/*
	 метод вызывается после каждой сказанной фразы. Параметра event используем атрибуты:
	 - resultIndex - нижний индекс в результирующем массиве
	 - results - массив всех результатов в текущей сессии
	 */
	recognition.onresult = function (event) {

		var interim_transcript = '';

		for (var i = event.resultIndex; i < event.results.length; ++i) {

			/* если фраза финальная (уже откорректированная) сохраняем в конечный результат */
			if (event.results[i].isFinal) {
				final_transcript += event.results[i][0].transcript;
			} else { /* иначе сохраянем в промежуточный */
				interim_transcript += event.results[i][0].transcript;
			}
		}

		final_span.innerHTML = final_transcript;
		interim_span.innerHTML = interim_transcript;
	};
}


function startButton(event) {
	if (recognizing) {
		recognition.stop();
		return;
	}

	recognition.start();

}
