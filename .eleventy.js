
module.exports = function(eleventyConfig) {
    // Copy the `img` and `css` folders to the output
    eleventyConfig.addPassthroughCopy('src/_images');

    // Show all posts in markdown
    eleventyConfig.addFilter('formatDate', (dateObj) => {
        return dateObj.toLocaleDateString('en-us', {year: 'numeric', month: 'short', day: 'numeric'});
    })

    // Filter the tags array to not include a "post" tag
    eleventyConfig.addFilter('noPostTag', (tagsArr) => {
        return tagsArr.filter((tag) => tag !== 'post');
    })

    // Directory Structure
    return {
        dir: {
            input: './src',
            data: '../_data',
            includes: '../_includes'
        }
    }
};
