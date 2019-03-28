'use strict '

export const isFilePathCSV = (filePath: string): boolean => {
	const regexp = /\.csv$/
	return regexp.test(filePath)
}
