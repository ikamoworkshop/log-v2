import { Transition } from '@unseenco/taxi'
import gsap from 'gsap'

export default class DefaultTransition extends Transition {
/**
 * Handle the transition leaving the previous page.
 * @param { { from: HTMLElement, trigger: string|HTMLElement|false, done: function } } props
 */
onLeave({ from, trigger, done }) {

    from.style.opacity = 1

    gsap.to(from, {
        opacity: 0,
        duration: .5,
        ease: 'power2.in-out',
    })

    setTimeout(() =>{
        done()
    }, 500)

}

/**
 * Handle the transition entering the next page.
 * @param { { to: HTMLElement, trigger: string|HTMLElement|false, done: function } } props
 */
onEnter({ to, trigger, done }) {

    to.style.opacity = 0

    gsap.to(to, {
        opacity: 1,
        duration: 2,
        ease: 'power2.in-out',
        onComplete: done()
    })

    // setTimeout(done(), 500)
}
}