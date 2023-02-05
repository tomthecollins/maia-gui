function instr_load_progress_monitor(){}

const instrData = {
  "sawtooth_synth": {
    "displayName": "Sawtooth synth",
    "tonejsDef": function(){
      const reverb = new Tone.Reverb().toDestination()
			const panner = new Tone.Panner(-1).connect(reverb)
      return new Tone.PolySynth(Tone.Synth, {
        "envelope": {
          "attack": 0.01,
				  "decay": 5,
					"sustain": 0
				},
				"oscillator": {
					type: "sawtooth4"
				}
      }).toDestination()
    },
    "tonejsInstanceof": "Tone.PolySynth",
    "range": [21, 108]
  },
  "mono_synth": {
    "displayName": "Mono synth",
    "tonejsDef": function(){
      return new Tone.PolySynth(Tone.MonoSynth).toDestination();
    },
    "tonejsInstanceof": "Tone.PolySynth",
    "range": [21, 108]
  },
  "am_synth": {
    "displayName": "AM synth",
    "tonejsDef": function(){
      return new Tone.PolySynth(Tone.AMSynth).toDestination();
    },
    "tonejsInstanceof": "Tone.PolySynth",
    "range": [21, 108]
  },
  "fm_synth": {
    "displayName": "FM synth",
    "tonejsDef": function(){
      return new Tone.PolySynth(Tone.FMSynth).toDestination();
    },
    "tonejsInstanceof": "Tone.PolySynth",
    "range": [21, 108]
  },
  "pluck_synth": {
    "displayName": "Pluck synth",
    "tonejsDef": function(){
      return new Tone.PluckSynth().toDestination();
    },
    "tonejsInstanceof": "Tone.PluckSynth",
    "range": [21, 108]
  },
  "acoustic_grand_piano": {
    "displayName": "Piano",
    "tonejsDef": function(){
      return new Tone.Sampler(
        {
          "C1": "./../src/instrument/acoustic_grand_piano/024_keyboard_acoustic_000-100.wav",
          "E1": "./../src/instrument/acoustic_grand_piano/028_keyboard_acoustic_000-100.wav",
          "G#1": "./../src/instrument/acoustic_grand_piano/032_keyboard_acoustic_000-100.wav",
          "C2": "./../src/instrument/acoustic_grand_piano/036_keyboard_acoustic_000-100.wav",
          "E2": "./../src/instrument/acoustic_grand_piano/040_keyboard_acoustic_000-100.wav",
          "G#2": "./../src/instrument/acoustic_grand_piano/044_keyboard_acoustic_000-100.wav",
          "C3": "./../src/instrument/acoustic_grand_piano/048_keyboard_acoustic_000-100.wav",
          "E3": "./../src/instrument/acoustic_grand_piano/052_keyboard_acoustic_000-100.wav",
          "G#3": "./../src/instrument/acoustic_grand_piano/056_keyboard_acoustic_000-100.wav",
          "C4": "./../src/instrument/acoustic_grand_piano/060_keyboard_acoustic_000-100.wav",
          "E4": "./../src/instrument/acoustic_grand_piano/064_keyboard_acoustic_000-100.wav",
          "G#4": "./../src/instrument/acoustic_grand_piano/068_keyboard_acoustic_000-100.wav",
          "C5": "./../src/instrument/acoustic_grand_piano/072_keyboard_acoustic_000-100.wav",
          "E5": "./../src/instrument/acoustic_grand_piano/076_keyboard_acoustic_000-100.wav",
          "G#5": "./../src/instrument/acoustic_grand_piano/080_keyboard_acoustic_000-100.wav",
          "C6": "./../src/instrument/acoustic_grand_piano/084_keyboard_acoustic_000-100.wav",
          "E6": "./../src/instrument/acoustic_grand_piano/088_keyboard_acoustic_000-100.wav",
          "G#6": "./../src/instrument/acoustic_grand_piano/092_keyboard_acoustic_000-100.wav",
          "C7": "./../src/instrument/acoustic_grand_piano/096_keyboard_acoustic_000-100.wav",
          "E7": "./../src/instrument/acoustic_grand_piano/100_keyboard_acoustic_000-100.wav",
          "G#7": "./../src/instrument/acoustic_grand_piano/104_keyboard_acoustic_000-100.wav",
          "C8": "./../src/instrument/acoustic_grand_piano/108_keyboard_acoustic_000-100.wav"
        },
        function(){
          console.log('Piano loaded!');
          if (typeof instr_load_progress_monitor === "function"){
            instr_load_progress_monitor();
          }
        }
      ).toDestination();
    },
    "tonejsInstanceof": "Tone.Sampler",
    "range": [21, 108]
  },
  "distortion_guitar": {
    "displayName": "Distortion guitar",
    "tonejsDef": function(){
      return new Tone.Sampler(
        {
          "G#1": "./../src/instrument/distortion_guitar/032_guitar_electronic_008-100.wav",
          "C2": "./../src/instrument/distortion_guitar/036_guitar_electronic_008-100.wav",
          "E2": "./../src/instrument/distortion_guitar/040_guitar_electronic_008-100.wav",
          "G#2": "./../src/instrument/distortion_guitar/044_guitar_electronic_008-100.wav",
          "C3": "./../src/instrument/distortion_guitar/048_guitar_electronic_008-100.wav",
          "E3": "./../src/instrument/distortion_guitar/052_guitar_electronic_008-100.wav",
          "G#3": "./../src/instrument/distortion_guitar/056_guitar_electronic_008-100.wav",
          "C4": "./../src/instrument/distortion_guitar/060_guitar_electronic_008-100.wav",
          "E4": "./../src/instrument/distortion_guitar/064_guitar_electronic_008-100.wav",
          "G#4": "./../src/instrument/distortion_guitar/068_guitar_electronic_008-100.wav",
          "C5": "./../src/instrument/distortion_guitar/072_guitar_electronic_008-100.wav",
          "E5": "./../src/instrument/distortion_guitar/076_guitar_electronic_008-100.wav",
          "G#5": "./../src/instrument/distortion_guitar/080_guitar_electronic_008-100.wav",
          "C6": "./../src/instrument/distortion_guitar/084_guitar_electronic_008-100.wav",
          "E6": "./../src/instrument/distortion_guitar/088_guitar_electronic_008-100.wav",
          "G#6": "./../src/instrument/distortion_guitar/092_guitar_electronic_008-100.wav",
          "C7": "./../src/instrument/distortion_guitar/096_guitar_electronic_008-100.wav",
          "E7": "./../src/instrument/distortion_guitar/100_guitar_electronic_008-100.wav",
          "G#7": "./../src/instrument/distortion_guitar/104_guitar_electronic_008-100.wav",
          "C8": "./../src/instrument/distortion_guitar/108_guitar_electronic_008-100.wav"
        },
        function(){
    			console.log('Distortion guitar loaded!');
          if (typeof instr_load_progress_monitor === "function"){
            instr_load_progress_monitor();
          }
        }
      ).toDestination();
    },
    "tonejsInstanceof": "Tone.Sampler",
    "range": [32, 108]
  },
  "clean_electric_guitar_2": {
    "displayName": "Electric guitar",
    "tonejsDef": function(){
      return new Tone.Sampler(
        {
          "G#1": "./../src/instrument/clean_electric_guitar_2/032_guitar_electronic_006-100.wav",
          "C2": "./../src/instrument/clean_electric_guitar_2/036_guitar_electronic_006-100.wav",
          "E2": "./../src/instrument/clean_electric_guitar_2/040_guitar_electronic_006-100.wav",
          "G#2": "./../src/instrument/clean_electric_guitar_2/044_guitar_electronic_006-100.wav",
          "C3": "./../src/instrument/clean_electric_guitar_2/048_guitar_electronic_006-100.wav",
          "E3": "./../src/instrument/clean_electric_guitar_2/052_guitar_electronic_006-100.wav",
          "G#3": "./../src/instrument/clean_electric_guitar_2/056_guitar_electronic_006-100.wav",
          "C4": "./../src/instrument/clean_electric_guitar_2/060_guitar_electronic_006-100.wav",
          "E4": "./../src/instrument/clean_electric_guitar_2/064_guitar_electronic_006-100.wav",
          "G#4": "./../src/instrument/clean_electric_guitar_2/068_guitar_electronic_006-100.wav",
          "C5": "./../src/instrument/clean_electric_guitar_2/072_guitar_electronic_006-100.wav",
          "E5": "./../src/instrument/clean_electric_guitar_2/076_guitar_electronic_006-100.wav",
          "G#5": "./../src/instrument/clean_electric_guitar_2/080_guitar_electronic_006-100.wav",
          "C6": "./../src/instrument/clean_electric_guitar_2/084_guitar_electronic_006-100.wav",
          "E6": "./../src/instrument/clean_electric_guitar_2/088_guitar_electronic_006-100.wav",
          "G#6": "./../src/instrument/clean_electric_guitar_2/092_guitar_electronic_006-100.wav",
          "C7": "./../src/instrument/clean_electric_guitar_2/096_guitar_electronic_006-100.wav",
          "E7": "./../src/instrument/clean_electric_guitar_2/100_guitar_electronic_006-100.wav",
          "G#7": "./../src/instrument/clean_electric_guitar_2/104_guitar_electronic_006-100.wav",
          "C8": "./../src/instrument/clean_electric_guitar_2/108_guitar_electronic_006-100.wav"
        },
        function(){
    			console.log('Electric guitar loaded!');
          if (typeof instr_load_progress_monitor === "function"){
            instr_load_progress_monitor();
          }
        }
      ).toDestination();
    },
    "tonejsInstanceof": "Tone.Sampler",
    "range": [32, 108]
  },
  "acoustic_guitar_nylon": {
    "displayName": "Acoustic guitar",
    "tonejsDef": function(){
      return new Tone.Sampler(
        {
          "G#1": "./../src/instrument/acoustic_guitar_nylon/032_guitar_acoustic_034-100.wav",
          "C2": "./../src/instrument/acoustic_guitar_nylon/036_guitar_acoustic_034-100.wav",
          "E2": "./../src/instrument/acoustic_guitar_nylon/040_guitar_acoustic_034-100.wav",
          "G#2": "./../src/instrument/acoustic_guitar_nylon/044_guitar_acoustic_034-100.wav",
          "C3": "./../src/instrument/acoustic_guitar_nylon/048_guitar_acoustic_034-100.wav",
          "E3": "./../src/instrument/acoustic_guitar_nylon/052_guitar_acoustic_034-100.wav",
          "G#3": "./../src/instrument/acoustic_guitar_nylon/056_guitar_acoustic_034-100.wav",
          "C4": "./../src/instrument/acoustic_guitar_nylon/060_guitar_acoustic_034-100.wav",
          "E4": "./../src/instrument/acoustic_guitar_nylon/064_guitar_acoustic_034-100.wav",
          "G#4": "./../src/instrument/acoustic_guitar_nylon/068_guitar_acoustic_034-100.wav",
          "C5": "./../src/instrument/acoustic_guitar_nylon/072_guitar_acoustic_034-100.wav",
          "E5": "./../src/instrument/acoustic_guitar_nylon/076_guitar_acoustic_034-100.wav",
          "G#5": "./../src/instrument/acoustic_guitar_nylon/080_guitar_acoustic_034-100.wav",
          "C6": "./../src/instrument/acoustic_guitar_nylon/084_guitar_acoustic_034-100.wav",
          "E6": "./../src/instrument/acoustic_guitar_nylon/088_guitar_acoustic_034-100.wav",
          "G#6": "./../src/instrument/acoustic_guitar_nylon/092_guitar_acoustic_034-100.wav",
          "C7": "./../src/instrument/acoustic_guitar_nylon/096_guitar_acoustic_034-100.wav",
          "E7": "./../src/instrument/acoustic_guitar_nylon/100_guitar_acoustic_034-100.wav",
          "G#7": "./../src/instrument/acoustic_guitar_nylon/104_guitar_acoustic_034-100.wav",
          "C8": "./../src/instrument/acoustic_guitar_nylon/108_guitar_acoustic_034-100.wav"
        },
        function(){
    			console.log('Acoustic guitar loaded!');
          if (typeof instr_load_progress_monitor === "function"){
            instr_load_progress_monitor();
          }
        }
      ).toDestination();
    },
    "tonejsInstanceof": "Tone.Sampler",
    "range": [32, 108]
  },
  "cello": {
    "displayName": "Cello",
    "tonejsDef": function(){
      return new Tone.Sampler(
        {
          "C1": "./../src/instrument/cello/024_string_acoustic_042-100.wav",
          "E1": "./../src/instrument/cello/028_string_acoustic_042-100.wav",
          "G#1": "./../src/instrument/cello/032_string_acoustic_042-100.wav",
          "C2": "./../src/instrument/cello/036_string_acoustic_042-100.wav",
          "E2": "./../src/instrument/cello/040_string_acoustic_042-100.wav",
          "G#2": "./../src/instrument/cello/044_string_acoustic_042-100.wav",
          "C3": "./../src/instrument/cello/048_string_acoustic_042-100.wav",
          "E3": "./../src/instrument/cello/052_string_acoustic_042-100.wav",
          "G#3": "./../src/instrument/cello/056_string_acoustic_042-100.wav",
          "C4": "./../src/instrument/cello/060_string_acoustic_042-100.wav",
          "E4": "./../src/instrument/cello/064_string_acoustic_042-100.wav",
          "G#4": "./../src/instrument/cello/068_string_acoustic_042-100.wav",
          "C5": "./../src/instrument/cello/072_string_acoustic_042-100.wav",
          "E5": "./../src/instrument/cello/076_string_acoustic_042-100.wav",
          "G#5": "./../src/instrument/cello/080_string_acoustic_042-100.wav",
          "C6": "./../src/instrument/cello/084_string_acoustic_042-100.wav",
          "E6": "./../src/instrument/cello/088_string_acoustic_042-100.wav",
          "G#6": "./../src/instrument/cello/092_string_acoustic_042-100.wav",
          "C7": "./../src/instrument/cello/096_string_acoustic_042-100.wav"
        },
        function(){
    			console.log('Cello loaded!');
          if (typeof instr_load_progress_monitor === "function"){
            instr_load_progress_monitor();
          }
        }
      ).toDestination();
    },
    "tonejsInstanceof": "Tone.Sampler",
    "range": [21, 96]
  },
  "acoustic_bass": {
    "displayName": "Acoustic bass",
    "tonejsDef": function(){
      return new Tone.Sampler(
        {
          "C1": "./../src/instrument/acoustic_bass/024_bass_acoustic_000-100.wav",
          "E1": "./../src/instrument/acoustic_bass/028_bass_acoustic_000-100.wav",
          "G#1": "./../src/instrument/acoustic_bass/032_bass_acoustic_000-100.wav",
          "C2": "./../src/instrument/acoustic_bass/036_bass_acoustic_000-100.wav",
          "E2": "./../src/instrument/acoustic_bass/040_bass_acoustic_000-100.wav",
          "G#2": "./../src/instrument/acoustic_bass/044_bass_acoustic_000-100.wav",
          "C3": "./../src/instrument/acoustic_bass/048_bass_acoustic_000-100.wav",
          "E3": "./../src/instrument/acoustic_bass/052_bass_acoustic_000-100.wav",
          "G#3": "./../src/instrument/acoustic_bass/056_bass_acoustic_000-100.wav",
          "C4": "./../src/instrument/acoustic_bass/060_bass_acoustic_000-100.wav",
          "E4": "./../src/instrument/acoustic_bass/064_bass_acoustic_000-100.wav",
          "G#4": "./../src/instrument/acoustic_bass/068_bass_acoustic_000-100.wav",
          "C5": "./../src/instrument/acoustic_bass/072_bass_acoustic_000-100.wav",
          "E5": "./../src/instrument/acoustic_bass/076_bass_acoustic_000-100.wav",
          "G#5": "./../src/instrument/acoustic_bass/080_bass_acoustic_000-100.wav",
          "C6": "./../src/instrument/acoustic_bass/084_bass_acoustic_000-100.wav",
        },
        function(){
    			console.log('Acoustic bass loaded!');
          if (typeof instr_load_progress_monitor === "function"){
            instr_load_progress_monitor();
          }
        }
      ).toDestination();
    },
    "tonejsInstanceof": "Tone.Sampler",
    "range": [21, 84]
  },
  "electric_bass_finger": {
    "displayName": "Bass guitar",
    "tonejsDef": function(){
      return new Tone.Sampler(
        {
          "C1": "./../src/instrument/electric_bass_finger/024_bass_electronic_005-100.wav",
          "E1": "./../src/instrument/electric_bass_finger/028_bass_electronic_005-100.wav",
          "G#1": "./../src/instrument/electric_bass_finger/032_bass_electronic_005-100.wav",
          "C2": "./../src/instrument/electric_bass_finger/036_bass_electronic_005-100.wav",
          "E2": "./../src/instrument/electric_bass_finger/040_bass_electronic_005-100.wav",
          "G#2": "./../src/instrument/electric_bass_finger/044_bass_electronic_005-100.wav",
          "C3": "./../src/instrument/electric_bass_finger/048_bass_electronic_005-100.wav",
          "E3": "./../src/instrument/electric_bass_finger/052_bass_electronic_005-100.wav",
          "G#3": "./../src/instrument/electric_bass_finger/056_bass_electronic_005-100.wav",
          "C4": "./../src/instrument/electric_bass_finger/060_bass_electronic_005-100.wav",
          "E4": "./../src/instrument/electric_bass_finger/064_bass_electronic_005-100.wav",
          "G#4": "./../src/instrument/electric_bass_finger/068_bass_electronic_005-100.wav",
          "C5": "./../src/instrument/electric_bass_finger/072_bass_electronic_005-100.wav",
          "E5": "./../src/instrument/electric_bass_finger/076_bass_electronic_005-100.wav",
          "G#5": "./../src/instrument/electric_bass_finger/080_bass_electronic_005-100.wav",
          "C6": "./../src/instrument/electric_bass_finger/084_bass_electronic_005-100.wav",
        },
        function(){
    			console.log('Bass guitar loaded!');
          if (typeof instr_load_progress_monitor === "function"){
            instr_load_progress_monitor();
          }
        }
      ).toDestination();
    },
    "tonejsInstanceof": "Tone.Sampler",
    "range": [21, 84]
  },
  "sitar": {
    "displayName": "Sitar",
    "tonejsDef": function(){
      return new Tone.Sampler(
        {
          "C1": "./../src/instrument/sitar/024_guitar_acoustic_035-100.wav",
          "E1": "./../src/instrument/sitar/028_guitar_acoustic_035-100.wav",
          "G#1": "./../src/instrument/sitar/032_guitar_acoustic_035-100.wav",
          "C2": "./../src/instrument/sitar/036_guitar_acoustic_035-100.wav",
          "E2": "./../src/instrument/sitar/040_guitar_acoustic_035-100.wav",
          "G#2": "./../src/instrument/sitar/044_guitar_acoustic_035-100.wav",
          "C3": "./../src/instrument/sitar/048_guitar_acoustic_035-100.wav",
          "E3": "./../src/instrument/sitar/052_guitar_acoustic_035-100.wav",
          "G#3": "./../src/instrument/sitar/056_guitar_acoustic_035-100.wav",
          "C4": "./../src/instrument/sitar/060_guitar_acoustic_035-100.wav",
          "E4": "./../src/instrument/sitar/064_guitar_acoustic_035-100.wav",
          "G#4": "./../src/instrument/sitar/068_guitar_acoustic_035-100.wav",
          "C5": "./../src/instrument/sitar/072_guitar_acoustic_035-100.wav",
          "E5": "./../src/instrument/sitar/076_guitar_acoustic_035-100.wav",
          "G#5": "./../src/instrument/sitar/080_guitar_acoustic_035-100.wav",
          "C6": "./../src/instrument/sitar/084_guitar_acoustic_035-100.wav",
          "E6": "./../src/instrument/sitar/088_guitar_acoustic_035-100.wav",
          "G#6": "./../src/instrument/sitar/092_guitar_acoustic_035-100.wav",
          "C7": "./../src/instrument/sitar/096_guitar_acoustic_035-100.wav"
        },
        function(){
    			console.log('Sitar loaded!');
          if (typeof instr_load_progress_monitor === "function"){
            instr_load_progress_monitor();
          }
        }
      ).toDestination();
    },
    "tonejsInstanceof": "Tone.Sampler",
    "range": [21, 96]
  },
  "muted_trumpet": {
    "displayName": "Muted brass",
    "tonejsDef": function(){
      return new Tone.Sampler(
        {
          "C1": "./../src/instrument/muted_trumpet/024_brass_acoustic_003-100.wav",
          "E1": "./../src/instrument/muted_trumpet/028_brass_acoustic_003-100.wav",
          "G#1": "./../src/instrument/muted_trumpet/032_brass_acoustic_003-100.wav",
          "C2": "./../src/instrument/muted_trumpet/036_brass_acoustic_003-100.wav",
          "E2": "./../src/instrument/muted_trumpet/040_brass_acoustic_003-100.wav",
          "G#2": "./../src/instrument/muted_trumpet/044_brass_acoustic_003-100.wav",
          "C3": "./../src/instrument/muted_trumpet/048_brass_acoustic_003-100.wav",
          "E3": "./../src/instrument/muted_trumpet/052_brass_acoustic_003-100.wav",
          "G#3": "./../src/instrument/muted_trumpet/056_brass_acoustic_003-100.wav",
          "C4": "./../src/instrument/muted_trumpet/060_brass_acoustic_003-100.wav",
          "E4": "./../src/instrument/muted_trumpet/064_brass_acoustic_003-100.wav",
          "G#4": "./../src/instrument/muted_trumpet/068_brass_acoustic_003-100.wav",
          "C5": "./../src/instrument/muted_trumpet/072_brass_acoustic_003-100.wav",
          "E5": "./../src/instrument/muted_trumpet/076_brass_acoustic_003-100.wav",
          "G#5": "./../src/instrument/muted_trumpet/080_brass_acoustic_003-100.wav",
          "C6": "./../src/instrument/muted_trumpet/084_brass_acoustic_003-100.wav",
        },
        function(){
    			console.log('Muted brass loaded!');
          if (typeof instr_load_progress_monitor === "function"){
            instr_load_progress_monitor();
          }
        }
      ).toDestination();
    },
    "tonejsInstanceof": "Tone.Sampler",
    "range": [21, 84]
  },
  "trumpet": {
    "displayName": "Trumpet",
    "tonejsDef": function(){
      return new Tone.Sampler(
        {
          "C3": "./../src/instrument/trumpet/048_brass_acoustic_023-100.wav",
          "E3": "./../src/instrument/trumpet/052_brass_acoustic_023-100.wav",
          "G#3": "./../src/instrument/trumpet/056_brass_acoustic_023-100.wav",
          "C4": "./../src/instrument/trumpet/060_brass_acoustic_023-100.wav",
          "E4": "./../src/instrument/trumpet/064_brass_acoustic_023-100.wav",
          "G#4": "./../src/instrument/trumpet/068_brass_acoustic_023-100.wav",
          "C5": "./../src/instrument/trumpet/072_brass_acoustic_023-100.wav",
          "E5": "./../src/instrument/trumpet/076_brass_acoustic_023-100.wav",
          "G#5": "./../src/instrument/trumpet/080_brass_acoustic_023-100.wav",
          "C6": "./../src/instrument/trumpet/084_brass_acoustic_023-100.wav",
          "E6": "./../src/instrument/trumpet/088_brass_acoustic_023-100.wav",
          "G#6": "./../src/instrument/trumpet/092_brass_acoustic_023-100.wav",
          "C7": "./../src/instrument/trumpet/096_brass_acoustic_023-100.wav"
        },
        function(){
    			console.log('Trumpet loaded!');
          if (typeof instr_load_progress_monitor === "function"){
            instr_load_progress_monitor();
          }
        }
      ).toDestination();
    },
    "tonejsInstanceof": "Tone.Sampler",
    "range": [48, 96]
  },
  "clarinet": {
    "displayName": "Clarinet",
    "tonejsDef": function(){
      return new Tone.Sampler(
        {
          "G#3": "./../src/instrument/clarinet/056_reed_acoustic_036-100.wav",
          "C4": "./../src/instrument/clarinet/060_reed_acoustic_036-100.wav",
          "E4": "./../src/instrument/clarinet/064_reed_acoustic_036-100.wav",
          "G#4": "./../src/instrument/clarinet/068_reed_acoustic_036-100.wav",
          "C5": "./../src/instrument/clarinet/072_reed_acoustic_036-100.wav",
          "E5": "./../src/instrument/clarinet/076_reed_acoustic_036-100.wav",
          "G#5": "./../src/instrument/clarinet/080_reed_acoustic_036-100.wav",
          "C6": "./../src/instrument/clarinet/084_reed_acoustic_036-100.wav",
          "E6": "./../src/instrument/clarinet/088_reed_acoustic_036-100.wav",
          "G#6": "./../src/instrument/clarinet/092_reed_acoustic_036-100.wav",
          "C7": "./../src/instrument/clarinet/096_reed_acoustic_036-100.wav",
          "E7": "./../src/instrument/clarinet/100_reed_acoustic_036-100.wav",
          "G#7": "./../src/instrument/clarinet/104_reed_acoustic_036-100.wav",
          "C8": "./../src/instrument/clarinet/108_reed_acoustic_036-100.wav"
        },
        function(){
          console.log('Clarinet loaded!');
          if (typeof instr_load_progress_monitor === "function"){
            instr_load_progress_monitor();
          }
        }
      ).toDestination();
    },
    "tonejsInstanceof": "Tone.Sampler",
    "range": [56, 108]
  },
  "flute": {
    "displayName": "Flute",
    "tonejsDef": function(){
      return new Tone.Sampler(
        {
          "G#3": "./../src/instrument/flute/056_flute_acoustic_004-100.wav",
          "C4": "./../src/instrument/flute/060_flute_acoustic_004-100.wav",
          "E4": "./../src/instrument/flute/064_flute_acoustic_004-100.wav",
          "G#4": "./../src/instrument/flute/068_flute_acoustic_004-100.wav",
          "C5": "./../src/instrument/flute/072_flute_acoustic_004-100.wav",
          "E5": "./../src/instrument/flute/076_flute_acoustic_004-100.wav",
          "G#5": "./../src/instrument/flute/080_flute_acoustic_004-100.wav",
          "C6": "./../src/instrument/flute/084_flute_acoustic_004-100.wav",
          "E6": "./../src/instrument/flute/088_flute_acoustic_004-100.wav",
          "G#6": "./../src/instrument/flute/092_flute_acoustic_004-100.wav",
          "C7": "./../src/instrument/flute/096_flute_acoustic_004-100.wav",
          "E7": "./../src/instrument/flute/100_flute_acoustic_004-100.wav",
          "G#7": "./../src/instrument/flute/104_flute_acoustic_004-100.wav",
          "C8": "./../src/instrument/flute/108_flute_acoustic_004-100.wav"
        },
        function(){
          console.log('Flute loaded!');
          if (typeof instr_load_progress_monitor === "function"){
            instr_load_progress_monitor();
          }
        }
      ).toDestination();
    },
    "tonejsInstanceof": "Tone.Sampler",
    "range": [56, 108]
  },
  "edm_drum_kit": {
    "displayName": "EDM drum kit",
    "tonejsDef": function(){
      return new Tone.Sampler(
        {
          "C2": "./../src/instrument/edm_drum_kit/036_kick_1.wav",
          "C#2": "./../src/instrument/edm_drum_kit/037_click.wav",
          "D2": "./../src/instrument/edm_drum_kit/038_snare_1.wav",
          "D#2": "./../src/instrument/edm_drum_kit/039_clap_1.wav",
          "E2": "./../src/instrument/edm_drum_kit/040_snare_2.wav",
          "F2": "./../src/instrument/edm_drum_kit/041_tom_1.wav",
          "F#2": "./../src/instrument/edm_drum_kit/042_hi-hat_1.wav",
          "G2": "./../src/instrument/edm_drum_kit/043_tom_2.wav",
          "G#2": "./../src/instrument/edm_drum_kit/044_hi-hat_2.wav",
          "A2": "./../src/instrument/edm_drum_kit/045_tom_3.wav",
          "A#2": "./../src/instrument/edm_drum_kit/046_hi-hat_open.wav",
          "B2": "./../src/instrument/edm_drum_kit/047_perc.wav",
          "C3": "./../src/instrument/edm_drum_kit/048_plate.wav",
          "C#3": "./../src/instrument/edm_drum_kit/049_crash.wav",
          "D3": "./../src/instrument/edm_drum_kit/050_shaker_2.wav",
          "D#3": "./../src/instrument/edm_drum_kit/051_ride.wav",
          "E3": "./../src/instrument/edm_drum_kit/052_snare_3.wav",
          "F3": "./../src/instrument/edm_drum_kit/053_clap_2.wav",
          "F#3": "./../src/instrument/edm_drum_kit/054_shaker_1.wav",
          "G3": "./../src/instrument/edm_drum_kit/055_scoop.wav",
          "G#3": "./../src/instrument/edm_drum_kit/056_jump.wav"
        },
        function(){
    			console.log('EDM drum kit loaded!');
          if (typeof instr_load_progress_monitor === "function"){
            instr_load_progress_monitor();
          }
        }
      ).toDestination();
    },
    "tonejsInstanceof": "Tone.Sampler",
    "range": [36, 56],
    "name2pitch": {
      "Bass drum": "C2",
      "Click": "C#2",
      "Snare short": "D2",
      "Clap wet": "D#2",
      "Snare long": "E2",
      "Tom-tom low": "F2",
      "Hi-hat closed": "F#2",
      "Tom-tom mid": "G2",
      "Hi-hat pedal": "G#2",
      "Tom-tom high": "A2",
      "Hi-hat open": "A#2",
      "Echo": "B2",
      "Plate": "C3",
      "Crash cymbal": "C#3",
      "Shaker double": "D3",
      "Ride cymbal": "D#3",
      "Clap snare": "E3",
      "Clap dry": "F3",
      "Shaker single": "F#3",
      "Dum": "G3",
      "Scoop": "G#3"
    }
  },
  "rock_drum_kit": {
    "displayName": "Rock drum kit",
    "tonejsDef": function(){
      return new Tone.Sampler(
        {
          "C2": "./../src/instrument/rock_drum_kit/036_kick.wav",
          "C#2": "./../src/instrument/rock_drum_kit/037_snare_rim.wav",
          "D2": "./../src/instrument/rock_drum_kit/038_snare.wav",
          "D#2": "./../src/instrument/rock_drum_kit/039_clap.wav",
          "E2": "./../src/instrument/rock_drum_kit/040_snare_2.wav",
          "F2": "./../src/instrument/rock_drum_kit/041_floor_tom.wav",
          "F#2": "./../src/instrument/rock_drum_kit/042_hi-hat_closed.wav",
          "G2": "./../src/instrument/rock_drum_kit/043_hanging_tom_low.wav",
          "G#2": "./../src/instrument/rock_drum_kit/044_hi-hat_pedal.wav",
          "A#2": "./../src/instrument/rock_drum_kit/046_hi-hat_open.wav",
          "B2": "./../src/instrument/rock_drum_kit/047_hanging_tom_mid.wav",
          "C#3": "./../src/instrument/rock_drum_kit/049_crash.wav",
          "D3": "./../src/instrument/rock_drum_kit/050_hanging_tom_high.wav",
          "D#3": "./../src/instrument/rock_drum_kit/051_ride.wav"
        },
        function(){
    			console.log('Rock drum kit loaded!');
          if (typeof instr_load_progress_monitor === "function"){
            instr_load_progress_monitor();
          }
        }
      ).toDestination();
    },
    "tonejsInstanceof": "Tone.Sampler",
    "range": [36, 51],
    "name2pitch": {
      "Bass drum": "C2",
      "Snare rim": "C#2",
      "Snare short": "D2",
      "Clap": "D#2",
      "Snare long": "E2",
      "Floor tom": "F2",
      "Hi-hat closed": "F#2",
      "Hanging tom low": "G2",
      "Hi-hat pedal": "G#2",
      "Hi-hat open": "A#2",
      "Hanging tom mid": "B2",
      "Crash cymbal": "C#3",
      "Hanging tom high": "D3",
      "Ride cymbal": "D#3"
    }
  }
}
