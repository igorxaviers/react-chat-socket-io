const Util = {

    dateNow: () => {
        let date = new Date();
        let hours = date.getHours() <= 9 ? `0${date.getHours()}` : date.getHours();
        let minutes = date.getMinutes() <= 9 ? `0${date.getMinutes()}` : date.getMinutes();
        return `${hours}:${minutes}`;
    }
};

export default Util;