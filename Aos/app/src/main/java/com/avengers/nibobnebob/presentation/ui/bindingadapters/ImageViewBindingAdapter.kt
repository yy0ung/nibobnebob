package com.avengers.nibobnebob.presentation.ui.bindingadapters

import android.widget.ImageView
import androidx.databinding.BindingAdapter
import com.avengers.nibobnebob.R

@BindingAdapter("filterRateBackground")
fun bindFilterBackground(iv: ImageView, rate: Int) = with(iv) {
    when (rate) {
        0 -> {
            setBackgroundResource(R.drawable.oval_primary1fill_nostroke)
        }

        1 -> {
            setBackgroundResource(R.drawable.oval_primary2fill_nostroke)
        }

        2 -> {
            setBackgroundResource(R.drawable.oval_primary3fill_nostroke)
        }

        3 -> {
            setBackgroundResource(R.drawable.oval_primary4fill_nostroke)
        }

        4 -> {
            setBackgroundResource(R.drawable.oval_primary5fill_nostroke)
        }

        else -> {
            setBackgroundResource(R.drawable.oval_primary1fill_nostroke)
        }
    }
}


@BindingAdapter("wishStatus")
fun bindWishStatus(iv: ImageView, isWish: Boolean) {
    iv.setBackgroundResource(
        if (isWish) R.drawable.ic_star_full else R.drawable.ic_star_border
    )
}