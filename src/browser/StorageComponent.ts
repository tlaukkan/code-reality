if (typeof AFRAME !== 'undefined') {
    AFRAME.registerComponent('storage', {
        schema: {
            url: {type: 'string', default: 'wss://aframe-storage-eu.herokuapp.com'},
            dimension: {type: 'string', default: ''}
        },

        init: function () {
            let data = this.data;
            console.log('storage component init: ' + JSON.stringify(this.data));
        },
        update: function (oldData) {
            console.log('storage component data updated');
        },
        tick: function (time, timeDelta) {
        }

    });

    console.log('storage component loaded');
}