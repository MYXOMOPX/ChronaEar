import "babel-polyfill"
// import yandex_speech from "yandex-speech"
// import {MicrophoneRecorder} from "./util/MicrophoneRecorder"
// var fs = require('fs');
//
// var file = fs.createWriteStream('test2.wav', { encoding: 'binary' })
//
//
// const microphone = new MicrophoneRecorder({
//     debug: true
// });
//
// setTimeout(function () {
//     console.log("ok");
//     microphone.stopRecord();
// },5500);
//
// microphone.startRecord().pipe(file);
//     // .pipe(yandex_speech.asr({
//     //         developer_key: '345fd072-2d2e-4e90-98ed-7a6358df570c',
//     //         debug: true,
//     //         topic: 'queries',
//     //         filetype: 'audio/x-pcm;bit=16;rate=16000'
//     //     }, function (err, httpResponse, xml) {
//     //         if (err) {
//     //             console.log(err);
//     //         } else {
//     //             console.log(httpResponse.statusCode, xml)
//     //         }
//     //     }
//     // ));
//
// setTimeout(function () {
//     console.log("End of timer");
// },50000);

import {yandexRecognizeSpeech} from "./asr/yandex-recognize-speech"

yandexRecognizeSpeech("345fd072-2d2e-4e90-98ed-7a6358df570c").then(x => console.log(x));