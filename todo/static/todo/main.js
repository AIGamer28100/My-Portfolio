function statusClick(id) {
	document.getElementById(`status${id}`).value = document.getElementById(`status${id}`).checked
	document.getElementById(`form${id}`).submit();
}

function TstatusClick(id) {
	document.getElementById(`Tstatus${id}`).value = document.getElementById(`Tstatus${id}`).checked
	document.getElementById(`Tform${id}`).submit();
}
