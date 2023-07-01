# Instructions

## Run the app locally

- Run `bundle install` to install BE dependencies.
- Run `yarn` to install FE dependencies.
- Run `./bin/dev`.
- App should be running at `http://localhost:3000/`.

## Run tests

- For BE tests, run `rake test`.
- For FE tests, run `yarn test` or simply `jest`.

## Configure the app for a different book

- Edit `javascript/constants/constants.ts` for UI facing variables related to the book, such as the title and author. You can also edit the URL for the book cover image there, or alternatively replace the image file in `public/images`.
- Edit `config/application.rb` to customize the prompt and example questions provided to the AI model.

## Run rake tasks to generate CSVs

- Run `rake generate_csvs:generate_book_content_csv['PDF_FILE_PATH']` to generate a CSV containing the book's pages from a PDF file, replacing PDF_FILE_PATH with the relative path to the file in your local machine. In some shells such as zsh you may need to escape the square brackets when running the command, like so
  `rake generate_csvs:generate_book_content_csv\['PDF_FILE_PATH'\]`.
- Run `rake generate_csvs:generate_embeddings_csv` to generate a CSV containing the embedding for each of the book pages, which will be used to get the relevant pages to send as input to the AI model.

# Key decisions and potential improvements

## Key decisions

- Decided to keep both BE and FE in a monolithic app for simplicity to deploy and maintain. This is a pretty simple and small app with a specific, constrained scope that is unlikely to scale much in the future, so it didn't make sense to overengineer it by splitting the BE and FE into separate services.
- Rails 7 migrates away from Webpacker and now makes it super easy to compile and bundle JS files with different well-known tools using the `jsbundling-rails` gem. I went with esbuild because it's known to be fast, although I could have picked rollup or Webpack and it would have worked too, and the specific tool likely didn't matter too much. With Rails 7, I only had to run the command to generate the Rails app specifying esbuild as the preferred tool, and no extra configuration was needed afterwards.
- In the past when building a monolith app with Rails for the BE and React for the FE, I've used a third-party library called [https://github.com/reactjs/react-rails](react-rails). With it I got two main benefits:
    - Server-side rendering, making the UI rendering faster and improving SEO.
    - A simple way to pass variables from the Rails controller to the React component as props. This came in handy to migrate existing Rails views to React components.

  This time I decided against using this library, because:
    - The UI is really minimal as well as its styling, and so any improvements in rendering were not going to be noticeable. The UI also has very little extra information for SEO that could't be specified in meta tags.
    - I didn't have a need to pass information from the Rails side to the React side on render as props.
  Not using a third-party library keeps the configuration a lot simpler, as well as keeps the app lighter in size.

- Split the logic from the presentational layer on the React side, with the logic living in a custom hook that is consumed by the React component. This allowed me to more easily write unit tests for the logical part. It also means each file has a more defined responsibility, making it easier to identify where a change should go depending on whether it's a visual change or a functional one.
- On the Rails side, I split all of the methods that were directly calling OpenAI into a separate service object. The goal there is that if at some point I decided to try out a different AI library, as long as I maintained the signature for the methods it'd be relatively easy to update that service to use something else instead of OpenAI without having to modify the controller logic.
- To get the answers from OpenAI, I decided to use the gpt-3.5 model with the ChatCompletion API instead of DaVinci with the Completion API. The reason was both pricing (gpt-3.5 is cheaper) and the fact that the ChatCompletion API allows you to send several messages in the request, specifying for each one whether the speaker has a role of "user", "assistant" or "system". This format seemed to fit the notion of sending a prompt + example questions to the model a bit better.

## Potential improvements

- When sending the book context to the AI model, getting the most relevant pages means that it's likely that
    - We're sending more information from the page that needed, as it's possible that only a portion of it contains something relevant to the question.
    - We're losing context from the previous page, as many pages begin mid-paragraph.
    - As we need to limit the amount of tokens we send, we usually end up sending 1 or 2 pages.

  One potential change to do there would be parse the PDF to generate a CSV with paragraphs instead of pages, and then from there generate embeddings for n-grams of paragraphs. Paragraphs will be shorter than pages allowing us to send more paragprahs from different pages and so more diverse context, and n-grams will allow us to preserve context that carries on from one paragraph to the next.

- At the moment if I made a change as described above, or if I tried swapping one AI model with a different one, it'd be hard to tell whether the change was positive or not. One thing that could be done here would be implementing a small survey at the end in the UI ("Was this answer useful?)", so that people can give feedback around how good the answer was. Having that in place, it'd be possible to do A-B testing and compare how different AI models or strategies affected the "usefulness" metric for the answers.
- The QuestionController has too many responsibilities at the moment. It not only has public methods which are exposed as endpoints, meant to return question information to the UI, but also has private methods dealing with the "behind the scenes" of asking a question. The logic for asking a question could probably be split up into a different controller or service.
- The logic to read embeddings from the CSV file and to get the corresponding book pages relies too much on a specific format for each of those files at the moment. Ideally it should be a bit "smarter" so that if the file had no headers, the headers were slightly different and so, the code would still work.
- Running the Rake tasks to generate the CSVs takes a while and it can be jarring to be staring at the command line without knowing what's going on. It'd be better UX to print some progress information to the console, maybe even a progress bar such as this one https://github.com/ondrejbartas/rake-progressbar.


