export default function(form:Record<string, (string | number)>){

    for(const [value] of Object.entries(form)){
        if(value.trim() === '') return false;
    }

    return true;
}