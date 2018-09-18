/**
 * Update our definition file.
 */
import { update } from "../src/update"
update((err, data) => {
  if (err) {
    console.error("Update unsuccessfull due to reasons")
    console.log(err.message)
    console.log(err.stack)

    return
  }
  console.log(
    "Successfully fetched and generated new parsers from the internets."
  )
})
