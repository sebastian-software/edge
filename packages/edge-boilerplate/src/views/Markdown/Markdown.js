import React from "react"
import Helmet from "react-helmet"

import Styles from "./Markdown.css"

import MarkdownMdx from "./Markdown.mdx"
import "prismjs/themes/prism-tomorrow.css"

class Markdown extends React.Component {
  render() {
    return (
      <article>
        <Helmet title="Markdown" />
        <MarkdownMdx value="Sebastian"/>
      </article>
    )
  }
}

export default Markdown
