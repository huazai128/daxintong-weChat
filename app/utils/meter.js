
export const meter = (value) => {
	let dict='';
	if(value){
		let num = Number(value).toFixed(2);
		if((num /1000)% 1000 >=1 ){
			dict = (Number(num) / 1000).toFixed(2) + 'km';
		}else{
			dict = Number(num).toFixed(0)+'m';
		}
	}
	return dict;
};
