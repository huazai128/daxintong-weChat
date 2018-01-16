
export const meter = (value) => {
	let dict='';
	if(value){
		let num = Number(value).toFixed(2);
		if((num /1000)% 1000 >=1 ){
			dict = (num / 1000).toFixed(2) + 'km';
		}else{
			dict = num+'m';
		}
	}
	return dict;
};
