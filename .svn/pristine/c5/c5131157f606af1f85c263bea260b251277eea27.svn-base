export const forDate = (t) => {
	if(typeof t !== 'number') return false;
	let timer = null;
	if(t <= 0){
		return false;
	}
	let seconds = Math.floor((t ) % 60);
	let minutes = Math.floor((t / 60) % 60);
	let hours = Math.floor((t / ( 60 * 60)) % 24);
	let days = Math.floor(t / ( 60 * 60 * 24));
	return `${ days ? `${days}天`:'' }${ hours? `${hours}小时`:''}${ minutes ? `${minutes }分`:'' }${ seconds }秒`;

};


