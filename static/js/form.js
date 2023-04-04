$(document).ready(function() {
    var is_ok = 'N';

    requestData();

    function requestData() {
        if (is_ok = 'N') {
            loadDoc();
            setTimeout(requestData, 1000);
        }
    }

    function loadDoc() {
        $.ajax({
			data : {
			},
			type : 'POST',
			url : '/get_data'
		})
		.done(function(data) {
			if (parseInt(data.sts) == 2) {
			    is_ok = 'Y'

			    window.location.href = '/facerecog/'+data.nik
			}
		});
    }

    

});