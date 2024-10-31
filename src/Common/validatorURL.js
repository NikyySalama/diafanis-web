const isValidUrl = (url) => {
    const urlPattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z0-9](?:[a-z0-9-]*[a-z0-9])?)\\.)+([a-z]{2,}|[a-z0-9-]{2,})(:\\d+)?(\\/[^\\s]*)?)$','i'); // domain and path
    return !!urlPattern.test(url);
};

const checkIMGByURL = async (url) => {
    if (!isValidUrl(url)) {
        return false; 
    }
    try {
        const response = await fetch(url, { method: 'HEAD',mode: 'no-cors' });
        const contentType = response.headers.get('Content-Type');
        return contentType && contentType.startsWith('image/');
    } catch (error) {
        console.error('Error fetching URL:', error);
        return false; 
    }
};

export default checkIMGByURL;
