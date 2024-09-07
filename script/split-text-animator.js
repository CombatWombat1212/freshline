// TODO: Give this its own file
// TODO: Add support for custom animations outside of just 'fade'
// TODO: custom durations, delays, etc.
// TODO: responsivity support where it replaces the element with the original unsplit element while resizing and then starts up again
// TODO: Make overlap optionally a float so you can set a threshhold of how complete the animation has to be before overlapping is allowed.
// TODO: Better handling for when you load the page with the element already in view
// TODO: Ability to change scroll trigger to affect your type and below, so if you choose line as the scroll trigger you can still use word and char but the lines will be the triggers for the elements they contain.

class SplitTextTarget {
  constructor(elem, parent, index) {
    this.elem = elem;
    this.parent = parent;
    this.index = index;
    this.running = false;
    this.animation = this.getAnimation();
  }

  init() {
    requestAnimationFrame(() => {
      gsap.set(this.elem, this.animation.enter.from);
    });
  }

  getDelay(index) {
    return this.parent.delay * index;
  }

  // TODO: If you prefer the idea of the animation being managed in the parent you could always move it back and do parent.getAnimation, i guess just because thats where delay and duration and such are set.
  getAnimation() {
    const listeners = (state) => {
      return {
        onStart: () => {
          this.running = true;
          this.parent.handleAnimationStart(this.index, state);
        },
        onComplete: () => {
          this.running = false;
          this.parent.handleAnimationComplete(this.index, state);
        },
      };
    };

    const defaults = ({ invert = false } = {}) => {
      const count = this.parent.count;
      const delay = invert ? this.getDelay([count - 1 - this.index]) : this.getDelay(this.index);
      return {
        duration: this.parent.duration,
        delay: delay,
      };
    };

    const enter = {
      from: fade.up.from,
      to: {
        ...fade.up.to,
        ...defaults({ invert: false }),
        ...listeners("enter"),
      },
    };

    const leave = {
      from: fade.up.to,
      to: {
        ...fade.up.from,
        ...defaults({ invert: true }),
        ...listeners("leave"),
      },
    };

    const enterBack = {
      from: fade.up.from,
      to: {
        ...fade.up.to,
        ...defaults({ invert: true }),
        ...listeners("enterBack"),
      },
    };

    const leaveBack = {
      from: fade.up.to,
      to: {
        ...fade.up.from,
        ...defaults({ invert: false }),
        ...listeners("leaveBack"),
      },
    };

    return {
      enter,
      leave,
      enterBack,
      leaveBack,
    };
  }
}

class SplitTextAnimator {
  constructor(elem, { type = "lines", overlap = false } = {}) {
    this.type = type;
    this.elem = elem;
    this.split = new SplitType(elem);
    this.delay = 0.05;
    this.duration = DEFAULT.DURATION;
    this.totalDuration = this.getTotalDuration();

    this.overlap = this.getOverlap(overlap);

    this.running = false; // Current state of whether an animation is running
    // this.prevRunning = false; // Previous state of running
    this.state = null; // Current state of the animation
    this.prevState = null; // State when running last became true

    this.scrollTriggerDefaults = {
      trigger: this.elem,
      ease: DEFAULT.EASE,
      start: "top bottom-=10%",
      end: "bottom top+=35%",
      markers: true,
    };

    this.handleScrollChange = this.handleScrollChange.bind(this);
    this.handleAnimationStart = this.handleAnimationStart.bind(this);
    this.handleAnimationComplete = this.handleAnimationComplete.bind(this);
    this.getSplitTargetCount = this.getSplitTargetCount.bind(this);
    this.getIsInverted = this.getIsInverted.bind(this);

    this.count = this.split[type].length;
    this.splitTargets = this.split[type].map((elem, index) => new SplitTextTarget(elem, this, index));
  }

  init() {
    this.splitTargets.forEach((target) => target.init());
    this.animateSplitTargets();
  }

  getOverlap(overlap) {
    if (typeof overlap == "boolean") {
      overlap = Number(overlap);
    }
    if (typeof overlap != "number" || overlap > 1) {
      console.log("Error: Overlap type.  Overlap must be either a bool or a number between 0-1");
    }

    return overlap;
  }

  getSplitTargetCount() {
    return this.count;
  }

  getTotalDuration() {
    return this.count * this.duration + (this.count - 1) * this.delay;
  }

  updateRunning(running) {
    // console.log(running);
    if (!this.running && running) {
      this.prevState = this.state;
    }

    if (this.running && !running) {
      if (this.prevState !== this.state) {
        // if (this.overlap == 0) return;
        // Prevents a flicker
        setTimeout(() => {
          this.handleScrollChange({ state: this.state, force: true });
        }, 0);
      }
    }

    this.running = running;
  }

  animateSplitTargets() {
    this.ScrollTrigger = ScrollTrigger.create({
      ...this.scrollTriggerDefaults,
      onEnter: () => this.handleScrollChange({ state: "enter" }),
      onEnterBack: () => this.handleScrollChange({ state: "enterBack" }),
      onLeave: () => this.handleScrollChange({ state: "leave" }),
      onLeaveBack: () => this.handleScrollChange({ state: "leaveBack" }),
    });
  }

  handleScrollChange({ state, force = false } = {}) {
    this.state = state;

    const invert = state == "enterBack" || state == "leave";
    const prevStateLeaving = this.prevState == "leave" || this.prevState == "leaveBack";
    const stateLeaving = this.state == "leave" || this.state == "leaveBack";

    const targets = this.splitTargets;

    // This inversion actually isn't necessary since inverting the delays is all you actually need to do, but its kinda nice since it makes the order of operations correct in terms of the for loop.  could be useful later.
    // Although if you change it here you need to get rid of it in handleAnimationComplete as well
    const t = invert ? [...targets].reverse() : targets;

    if (this.running) return;
    // this.updateRunning(true);

    // const totalCount = this.count;
    // const completedCount = this.splitTargets.filter((target) => !target.running).length;
    // const overlapPoint = totalCount - Math.ceil(this.overlap * totalCount);
    // if(overlapPoint != completedCount) return;

    // console.log('starting at '+ completedCount);

    t.forEach((target) => {
      //   console.log("run");
      // if (!this.overlap && this.running && !force) return;
      //   if (this.running && !force) return;
      requestAnimationFrame(() => {
        run(target);
      });
    });

    const run = (target) => {
      // Initialize the props object with default properties
      const props = {
        from: {
          ...target.animation[state].from,
        },
        to: {
          ...target.animation[state].to,
        },
      };

      // Check if force is true and modify props accordingly
      if (force) {
        props.from = {
          ...target.animation[this.prevState]?.to,
        };
        props.to = {
          ...target.animation[this.state].to,
          ...(prevStateLeaving && stateLeaving ? { duration: 0, delay: 0 } : {}),
        };
      }

      // Perform the gsap animation with the calculated props
      // gsap.fromTo(target.elem, props.from, props.to);

      gsap.to(target.elem, props.to);
    };
  }

  getIsInverted(index, state) {
    const invert = state == "enterBack" || state == "leave";
    return (invert && index !== this.count - 1) || (!invert && index !== 0);
  }

  handleAnimationStart(index, state) {
    if (this.splitTargets.filter((target) => target.running).length === 1) {
      if (this.running) return;
      //   console.log("One child is running, so i started");
      this.updateRunning(true);
    }

    // const totalCount = this.count;
    // const completedCount = this.splitTargets.filter((target) => target.running).length;
    // const overlapPoint = totalCount - Math.ceil(this.overlap * totalCount);

    // if (completedCount >= overlapPoint) {
    //   if (!this.running) return;
    //   console.log('start');
    //   this.updateRunning(true);
    // }

    // if (this.splitTargets.filter((target) => target.running).length === 1) {
    //   this.updateRunning(true, index);
    // }
  }

  handleAnimationComplete(index, state) {
    // if (!this.overlap && this.splitTargets.every((target) => !target.running)) {
    //   this.updateRunning(false, index);
    // }

    // if (this.splitTargets.every((target) => !target.running)) {
    //   this.updateRunning(false, index);
    // }

    const totalCount = this.count;
    const completedCount = this.splitTargets.filter((target) => !target.running).length;
    const overlapPoint = totalCount - Math.ceil(this.overlap * totalCount);

    if (completedCount >= overlapPoint) {
      if (!this.running) return;
    //   console.log(completedCount, overlapPoint);
      this.updateRunning(false, index);
    }
  }
}
