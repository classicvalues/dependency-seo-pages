import { GetServerSideProps } from 'next'

import { searchDependency } from '../../services/algolia'
import SEO from '../../components/seo'
import Main from '../../components/main'
import { getPackageInfo, PackageInfo } from '../../services/packageInfo'

const HomePage: React.FC<{
  sandboxes?: any[]
  packageName?: string
  hasMoreToLoad?: boolean
  packageInfo?: PackageInfo
}> = ({ sandboxes, packageName, packageInfo, hasMoreToLoad }) => {
  try {
    return (
      <>
        <SEO
          pkg={packageName}
          title={`${packageName} examples - CodeSandbox`}
        />
        <Main
          packageName={packageName}
          packageInfo={packageInfo}
          sandboxes={sandboxes}
          hasMoreToLoad={hasMoreToLoad}
        />
      </>
    )
  } catch (err) {
    console.error(err)
  }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params

  // No valid slug
  if (!context.params.slug) {
    return { notFound: true }
  }

  let packageName: string
  if (Array.isArray(slug)) {
    packageName = slug.join('/')
  } else {
    packageName = slug
  }

  const { sandboxes, hasMoreToLoad } = await searchDependency(packageName)
  const packageInfo = await getPackageInfo(packageName)

  // No data
  if (sandboxes.length === 0) {
    return { notFound: true, props: { packageName } }
  }

  return {
    props: { sandboxes, packageName, hasMoreToLoad, packageInfo }
  }
}

export default HomePage
