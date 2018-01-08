import childProcess from "child_process";
const spawn = childProcess.spawn;


export class MicrophoneRecorder {
    /**
     * settings of recorder.
     * @const
     * @type {Object}
     */
    $options = null;
    /**
     * sox process
     */
    $process = null;

    constructor(options) {
        const defaultOptions = {
            sampleRate: 16000,
            channels: 1,
            compress: false,
            threshold: 0.5,
            thresholdStart: null,
            thresholdEnd: null,
            silence: undefined,
            verbose: false,
            audioType: "wav",
            recordProgram: 'sox'
        };

        this.$options = Object.assign(defaultOptions, options);
        Object.freeze(this.$options);
    }

    $getCmdArguments(silenceSeconds) {
        const cmdArgs = [
            "-q",                                           // no progress
            "-t", "waveaudio",                              // audio type?
            "-d",                                           // default recording device
            "-r", this.$options.sampleRate.toString(),      // sample rate
            "-c", "1",                                      // one channel
            "-e", "signed-integer",                         // encoding
            "-b", "16",                                     // 16 bits
            "-t", this.$options.audioType,                  // stream audio type
            "-",                                            // open stream
        ];
        if (this.$options.silence) {
            let minutes = Math.floor(this.$options.silence / 60);
            let seconds = this.$options.silence % 60;
            if (seconds < 10) seconds = `0${seconds}`;
            let timeParam = `${minutes}:${seconds}`;
            cmdArgs.push(`silence 1 0.01 1% 1 ${timeParam} 1%`);
        }
        return cmdArgs;
    }

    /**
     * Starts recording
     * @param silenceSeconds
     * @return {Stream}
     */
    startRecord(silenceSeconds){
        if (this.$process != null) throw "recording already started";
        this.$process = spawn("sox", this.$getCmdArguments(silenceSeconds), {encoding: "binary"});
        if (this.$options.debug) {
            console.log('Recording', this.$options.channels, 'channels with sample rate',
                this.$options.sampleRate + '...');
            console.time('End Recording');

            this.$process.on('data', function (data) {
                console.log('Recording %d bytes', data.length)
            });

            this.$process.on('end', function () {
                console.timeEnd('End Recording')
            });
        }
        return this.$process.stdout;
    }

    /**
     * Stops recording
     */
    stopRecord(){
        if (this.$process == null) throw "nothing to stop";
        this.$process.kill();
        this.$process = null;
    }
}