export default function(form:Record<string, string>){

    for(const [value] of Object.entries(form)){
        if(value.trim() === '') return false;
    }

    return true;
}