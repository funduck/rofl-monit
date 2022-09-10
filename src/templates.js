module.exports = {

  container_start : e =>
`Started container <b>${e.Actor.Attributes.name}</b>
Image: <b>${e.Actor.Attributes.image}</b>
Container ID: <b>${e.Actor.ID}</b>`,

  container_kill : e =>
`User killed container <b>${e.Actor.Attributes.name}</b>
Image: <b>${e.Actor.Attributes.image}</b>
Exit Code: <b>${e.Actor.Attributes.exitCode}</b>
Container ID: <b>${e.Actor.ID}</b>`,

container_die : e =>
`Died container <b>${e.Actor.Attributes.name}</b>
Image: <b>${e.Actor.Attributes.image}</b>
Exit Code: <b>${e.Actor.Attributes.exitCode}</b>
Container ID: <b>${e.Actor.ID}</b>`,

container_restart : e =>
`Restarted container <b>${e.Actor.Attributes.name}</b>
Image: <b>${e.Actor.Attributes.image}</b>
Container ID: <b>${e.Actor.ID}</b>`,

  container_destroy : e =>
`Destroyed container <b>${e.Actor.Attributes.name}</b>
Image: <b>${e.Actor.Attributes.image}</b>
Container ID: <b>${e.Actor.ID}</b>`,

  network_create : e =>
`Created network \`${e.Actor.Attributes.name}\``,

  network_destroy : e =>
`Destroyed network \`${e.Actor.Attributes.name}\``,

}
