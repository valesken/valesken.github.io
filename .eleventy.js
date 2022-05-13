
module.exports = function(eleventyConfig) {

    // Copy the CNAME file
    eleventyConfig.addPassthroughCopy('src/CNAME');

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

    // .eleventy.js
    eleventyConfig.addCollection("post", function(collection) {
        const postCollection = collection.getFilteredByTag("post");

        for(let i = 0; i < postCollection.length ; i++) {
            const prevPost = postCollection[i-1];
            const nextPost = postCollection[i+1];

            postCollection[i].data["prevPost"] = prevPost;
            postCollection[i].data["nextPost"] = nextPost;
        }

        return postCollection;
    });


    // Directory Structure
    return {
        dir: {
            input: './src',
            data: '../_data',
            includes: '../_includes'
        }
    }
};
