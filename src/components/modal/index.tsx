import React from 'react'
import styled, { css } from 'styled-components'
import { animated, useTransition, config } from '@react-spring/web'
import { DialogOverlay, DialogContent } from '@reach/dialog'
import '@reach/dialog/styles.css'
import { transparentize } from 'polished'
import { useIsMobile } from '../../hooks/useIsMobile'

const AnimatedDialogOverlay = animated(DialogOverlay)
const StyledDialogOverlay = styled(AnimatedDialogOverlay)`
  &[data-reach-dialog-overlay] {
    z-index: 10;
    overflow: hidden;

    display: flex;
    align-items: center;
    justify-content: center;

    background-color: ${({ theme }) => transparentize(0.65, theme.black)};
  }
`

const AnimatedDialogContent = animated(DialogContent)
// destructure to not pass custom props to Dialog DOM element
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDialogContent = styled(({ minHeight, maxHeight, maxWidth, mobile, open, ...rest }) => (
  <AnimatedDialogContent {...rest} />
)).attrs({
  'aria-label': 'dialog',
})`
  overflow-y: ${({ mobile }) => (mobile ? 'scroll' : 'hidden')};

  &[data-reach-dialog-content] {
    background: none;
    box-shadow: 0px 16px 12px ${({ theme }) => transparentize(0.55, theme.boxShadow)};
    padding: 0px;
    width: ${({ mobile }) => (mobile ? '100%' : '50vw')};
    margin: ${({ mobile }) => (mobile ? '8px' : '0px')};
    overflow-y: ${({ mobile }) => (mobile ? 'scroll' : 'hidden')};
    overflow-x: hidden;

    align-self: ${({ mobile }) => (mobile ? 'flex-end' : 'center')};

    max-width: ${({ maxWidth, mobile }) => (mobile ? '100%' : `${maxWidth}px`)};
    ${({ maxHeight }) =>
      maxHeight &&
      css`
        max-height: ${maxHeight}vh;
      `}
    ${({ minHeight }) =>
      minHeight &&
      css`
        min-height: ${minHeight}vh;
      `}
    display: flex;
    border-radius: 8px;
  }
`

interface ModalProps {
  open: boolean
  onDismiss: () => void
  minHeight?: number | false
  maxHeight?: number
  maxWidth?: number
  initialFocusRef?: React.RefObject<any>
  children?: React.ReactNode
  className?: string
}

export function Modal({
  open,
  onDismiss,
  minHeight = false,
  maxHeight = 90,
  maxWidth = 460,
  initialFocusRef,
  children,
  className,
}: ModalProps) {
  const isMobile = useIsMobile()
  const transition = useTransition(open, {
    config: { ...config.molasses, duration: 200 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  })

  return (
    <>
      {transition(
        ({ opacity }, item) =>
          item && (
            <StyledDialogOverlay style={{ opacity }} onDismiss={onDismiss} initialFocusRef={initialFocusRef}>
              <StyledDialogContent
                aria-label="dialog content"
                minHeight={minHeight}
                maxHeight={maxHeight}
                maxWidth={maxWidth}
                mobile={isMobile}
                className={className}
              >
                {/* prevents the automatic focusing of inputs on mobile by the reach dialog */}
                {!initialFocusRef && isMobile ? <div tabIndex={1} /> : null}
                {children}
              </StyledDialogContent>
            </StyledDialogOverlay>
          )
      )}
    </>
  )
}