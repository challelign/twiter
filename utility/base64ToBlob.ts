function base64ToBlob(base64: string, contentType: string = "") {
	const binaryString = window.atob(base64);
	const arrayBuffer = new ArrayBuffer(binaryString.length);
	const uint8Array = new Uint8Array(arrayBuffer);

	for (let i = 0; i < binaryString.length; i++) {
		uint8Array[i] = binaryString.charCodeAt(i);
	}

	return new Blob([uint8Array], { type: contentType });
}
