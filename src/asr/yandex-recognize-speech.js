import {MicrophoneRecorder} from "../util/MicrophoneRecorder"
import request from "request"
import querystring from "querystring"
import xml2js from "xml2js"

/**
 * speech to text.
 * @param token - yandex token
 * @return {Promise.<String>}
 */
export function yandexRecognizeSpeech(token) {
    const microphone = new MicrophoneRecorder({audioType: "raw"});
    const params = {
        key: token,
        uuid: generateUUID(),
        topic: "queries",
        lang: "ru-RU"
    };

    return new Promise(function (resolve, reject) {
        setTimeout(() => microphone.stopRecord(), 6000);
        microphone.startRecord().pipe(request({
            url: getRequestPath(params),
            headers: {
                "Content-Type": "audio/x-pcm;bit=16;rate=16000",
                "Transfer-Encoding": "chunked"
            },
        }, function (err, resp, body) {
            if (err) return reject(err);
            xml2js.parseString(body, (err, result) => {
                if (err) return reject(err);
                result = result["recognitionResults"];
                if (!+result["$"]["success"]) return reject("no results");
                const texts = result["variant"].sort((a,b) => {
                    const confA = a["$"]["confidence"];
                    const confB = b["$"]["confidence"];
                    if (confA > confB) return 1;
                    if (confA == confB) return 0;
                    return -1;
                }).map(variant => variant["_"]);
                resolve(texts)
            })
        }));
    });
}

function getRequestPath(params) {
    return "http://asr.yandex.net/asr_xml?" + querystring.stringify(params)
}

function generateUUID() {
    return "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx".replace(/x/g, function () {
        return Math.floor(Math.random()*16).toString(16)
    })
}