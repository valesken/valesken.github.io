
module.exports = function(eleventyConfig) {

    // Copy the `images` folder to the output
    eleventyConfig.addPassthroughCopy('src/_images');

    // Watch for changes to `_css` folder when developing
    eleventyConfig.addWatchTarget("./src/_css/");

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
