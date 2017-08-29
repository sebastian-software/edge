/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */

import "@storybook/addon-actions/register"
import "@storybook/addon-links/register"
import "@storybook/addon-knobs/register"
import registerScissors from "storybook-addon-scissors"
import devices from "./devices.json"

registerScissors(devices)
