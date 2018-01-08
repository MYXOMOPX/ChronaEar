import {MicrophoneRecorder} from "./util/MicrophoneRecorder"
import snowboy from "snowboy"
import {YandexSpeechRecognizer} from "./asr/yandex-recognize-speech"
import fs from "fs";
import {yandexRecognizeSpeech} from "./asr/yandex-recognize-speech"

const hotwordsDir = "./keywords";

const models = new snowboy.Models();
const speechRecognizer = new YandexSpeechRecognizer();


const detector = new Detector({
    models: models,
    audioGain: 2.0
});

detector.on('hotword', function (index, hotword, buffer) {
    record.stop();
    speechRecognizer.speechToText(record.start()).then(text => {

    })
});

export class HronaEar {

    constructor(name, serverAddress) {
        this.name = name;
        this.serverAddress = serverAddress;

        this.$microphone = new MicrophoneRecorder({audioType:"raw"});

        this.$hotwordsModels = new snowboy.Models();
        this.$loadHotwords()

        const detector = this.$detector = new Detector({
            models: models,
            audioGain: 2.0
        });

    }

    $loadHotwords(){
        fs.readdirSync(hotwordsDir).forEach(fileName => {
            const dotIndex = fileName.lastIndexOf(".");
            const hotword = fileName.substring(0,dotIndex);
            this.$hotwordsModels.add({
                file: `${hotwordsDir}/${fileName}`,
                sensitivity: '0.5',
                hotwords : hotword
            });
        });
    }

    $onHotword(index, hotword, buffer) {
        this.$microphone.stopRecord();
        yandexRecognizeSpeech().then((text) => {
            this.$startSnowboy();
            this.$onTextRecognized(text)
        }, () => {})
    }

    $onTextRecognized(text) {
        console.log("Text",text);
    }

    $startSnowboy(){
        this.$microphone.startListen().pipe(this.$detector);
    }

    $listening = false;
    startListen(){
        if (this.$listening) return;
        this.$listening = true;
        this.$startSnowboy();
    }

    stopListen(){
        if (!this.$listening) return;
        this.$microphone.stopRecord();
        this.$listening = false;
    }
}