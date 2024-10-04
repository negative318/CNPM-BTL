import { FloatingOverlay, FloatingPortal } from '@floating-ui/react'
import { Fragment } from 'react'
import { motion } from 'framer-motion'
import { ColorRing } from 'react-loader-spinner'

export default function LoadingPage() {
  return (
    <FloatingPortal>
      <FloatingOverlay lockScroll>
        <Fragment>
          <motion.div
            className='fixed inset-0 z-10 bg-black dark:bg-black'
            initial={{ opacity: 0 }}
            animate={{
              opacity: 0.2
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            className='fixed z-10 flex items-center justify-center -translate-x-1/2 -translate-y-1/2 shadow-sm left-1/2 top-1/2 rounded-2xl'
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ColorRing
              visible={true}
              height='80'
              width='80'
              ariaLabel='blocks-loading'
              wrapperStyle={{}}
              wrapperClass='blocks-wrapper'
              colors={['#05668D', '#05668D', '#05668D', '#05668D', '#05668D']}
            />
          </motion.div>
        </Fragment>
      </FloatingOverlay>
    </FloatingPortal>
  )
}
