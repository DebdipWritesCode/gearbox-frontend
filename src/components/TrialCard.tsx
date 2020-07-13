import React from 'react'
import { Trial } from '../model'

const styles = {
  container:
    'border border-solid border-black hover:border-red-500 hover:bg-red-100 m-4 py-4 px-8',
  title: 'font-bold text-lg pb-2',
  subtitle: 'font-bold inline pr-2',
}

const TrialCard = ({
  data: { title, group, location, registerLinks },
}: {
  data: Trial
}) => (
  <div className={styles.container}>
    <h2 className={styles.title}>{title}</h2>

    <h3 className={styles.subtitle}>Research group</h3>
    {group}
    <br />

    <h3 className={styles.subtitle}>Location</h3>
    {location}
    <br />

    <details>
      <summary>
        <h3 className={styles.subtitle}>Registration information</h3>
      </summary>
      {registerLinks?.map(({ name, url }, i) => (
        <a className="block text-blue-700" href={url} target="blank" key={i}>
          {name}
        </a>
      ))}
    </details>
  </div>
)

export default TrialCard