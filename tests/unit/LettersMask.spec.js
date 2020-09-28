import { shallowMount } from '@vue/test-utils'
import LettersMask from '@/components/lettersMask/LettersMask.vue'

describe('LettersMask.vue', () => {
  it('renders props.msg when passed', () => {
    const seqs = [{ seq: "ACGTGAGCTACTA" }, { seq: "ATTTGAGCTACTT" }];
    const wrapper = shallowMount(LettersMask, {
      propsData: { seqs }
    })
    expect(wrapper.text()).toMatch(msg)
  })
})
