


$(document).ready(function(){

	$('#btn-like').click(function(event){

		event.preventDefault();

		let imgId = $(this).data('id');

		$.post('/image/' + imgId + '/like').done(function(data){
			$('.likes-count').text(data.likes);

		});
	});

	let remove = false;		//global variable

	$('#btn-delete').click(function(event){

		event.preventDefault();

		let $this = $(this);

		$('#myModal').modal('show');

		//remove = confirm('Are You Sure You Want To Delete this Image') // the confirm fxn( confirm dialog box) is one that returns a value
		
		
		$('#btn-modal-yes').click(function(){
			remove = true;

			if(remove){

				let imgId = $this.data('id');

				$.ajax({
					'url':'/image/' + imgId,
					'type': 'DELETE'
				}).done(function(result){	
					if(result){
						$this.removeClass('btn-danger').addClass('btn-success');
						$this.find('i').remove(); 			//the find method is used to search for any element
						$this.append('Deleted ');
						$this.append('<i class="fa fa-check"></i>');
						setTimeout(function(){
							location.href ='/';
						},3000)
					}
				});
			}

		});
	});

	$('#post-comment').hide();

	$('#btn-comment').click(function(){
		$('#post-comment').slideToggle(1000);
	});

})